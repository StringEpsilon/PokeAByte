using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using BizHawk.Client.Common;
using BizHawk.Emulation.Common;
using PokeAByte.Protocol;

namespace PokeAByte.Integrations.BizHawk;

[ExternalTool("Emulator Data Protocol Server")]
public sealed class EDPSForm : Form, IExternalToolForm, IDisposable
{
    public ApiContainer? APIs { get; set; }

    [RequiredService]
    public IMemoryDomains? MemoryDomains { get; set; }

    private readonly Label MainLabel = new()
    {
        Text = "Loading...",
        Height = 50,
        TextAlign = ContentAlignment.MiddleCenter,
        Dock = DockStyle.Top
    };

    public bool IsActive { get; }

    public bool IsLoaded { get; }

    private SharedPlatformConstants.PlatformEntry? _platform;
    private string System = string.Empty;

    private EmulatorProtocolServer? _udpServer;
    private ReadBlock[]? _blocks;
    private MemoryMappedFile? _dataFile;
    private MemoryMappedViewAccessor? _dataAccessor;
    private byte[] _dataBuffer = new byte[0];

    public EDPSForm()
    {
        base.Text = "Emulator Data Protocol Server";
        ShowInTaskbar = false;

        ClientSize = new(300, 60);
        SuspendLayout();

        Controls.Add(MainLabel);

        ResumeLayout(performLayout: false);
        PerformLayout();
        StartServer();

        Closing += (sender, args) =>
        {
            Cleanup();
        };
        IsLoaded = true;
        IsActive = true;
    }

    private void StartServer() {
        _udpServer = new EmulatorProtocolServer();
        _udpServer.OnWrite = WriteToMemory;
        _udpServer.OnSetup = Setup;
        _udpServer.Start();
    }

    private void Cleanup()
    {
        MainLabel.Text = $"Waiting for Client...";
        _udpServer?.Dispose();
        _dataFile?.Dispose();
        _dataFile = null;
        _dataAccessor?.Dispose();
        _dataAccessor = null;
        if (File.Exists("/dev/shm/EDPS_MemoryData.bin"))
        {
            File.Delete("/dev/shm/EDPS_MemoryData.bin");
        }
    }

    private MemoryMappedFile CreateMMF(int size)
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return MemoryMappedFile.CreateOrOpen("EDPS_MemoryData.bin", size, MemoryMappedFileAccess.ReadWrite);
        }
        if (File.Exists("/dev/shm/EDPS_MemoryData.bin"))
        {
            File.Delete("/dev/shm/EDPS_MemoryData.bin");
        }
        return MemoryMappedFile.CreateFromFile(
            "/dev/shm/EDPS_MemoryData.bin",
            FileMode.OpenOrCreate,
            null,
            size,
            MemoryMappedFileAccess.ReadWrite
        );
    }

    private void Setup(SetupInstruction instruction)
    {
        MainLabel.Text = $"Setting up data connection";
        int totalSize = 0;
        _blocks = new ReadBlock[instruction.BlockCount];
        for (int i = 0; i < instruction.BlockCount; i++)
        {
            totalSize += instruction.Data[i].Length;
            _blocks[i] = instruction.Data[i];
        }
        if (totalSize == 0) {
            throw new InvalidDataException("Setup instruction came with invalid block sizes. ");
        }
        _dataFile = this.CreateMMF(totalSize);
        _dataAccessor = _dataFile.CreateViewAccessor();
        _dataBuffer = new byte[totalSize];
        MainLabel.Text = $"Providing memory data ({totalSize} bytes) to client...";
    }

    private void WriteToMemory(WriteInstruction instruction)
    {
        if (instruction.Data.Length == 0 || APIs == null)
        {
            Console.WriteLine("Zero length write instruction. Abort.");
            return;
        }
        try
        {
            APIs.Memory.WriteByteRange(instruction.Address, instruction.Data);
        }
        catch (Exception)
        {
            // todo: error handling?
        }
    }

    public void Restart()
    {
        Cleanup();
        StartServer();
        System = APIs?.Emulation.GetGameInfo()?.System ?? string.Empty;
        _platform = SharedPlatformConstants.Information.SingleOrDefault(x => x.BizhawkIdentifier == System);

        if (string.IsNullOrWhiteSpace(System))
        {
            MainLabel.Text = "No game is loaded, doing nothing.";
        }
        else
        {
            MainLabel.Text = $"Waiting for client...";
        }
    }


    public bool AskSaveChanges() => true;

    private void UpdateAfter()
    {
        if (_dataAccessor == null || _blocks == null || APIs == null || _platform == null)
        {
            return;
        }
        
        foreach (var block in _blocks)
        {
            long domainAddress = 0;
            try
            {
                var entry = _platform.MemoryLayout
                    .FirstOrDefault(x => x.PhysicalStartingAddress <= block.GameAddress && x.PhysicalEndingAddress >= block.GameAddress + block.Length);
                if (entry == null)
                {
                    break;
                }
                var memoryDomain = MemoryDomains?[entry.BizhawkIdentifier] ?? throw new Exception($"Memory domain not found.");
                var address = (long)block.GameAddress - entry.PhysicalStartingAddress;
                APIs.Memory.ReadByteRange(address,  block.Length, entry.BizhawkIdentifier).ToArray().CopyTo(_dataBuffer, block.Position);
            }
            catch (Exception ex)
            {
                MainLabel.Text = $"Error reading {domainAddress:x2}: {ex.Message}";
            }
        }
        _dataAccessor.WriteArray(
            0,
            _dataBuffer,
            0,
            _dataBuffer.Length
        );
    }

    public void UpdateValues(ToolFormUpdateType type)
    {
        if (type == ToolFormUpdateType.PostFrame)
        {
            UpdateAfter();
        }
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            this._udpServer?.Dispose();
            this._udpServer = null;
        }
        base.Dispose(disposing);
    }
}


#region PlatformConstants
public static class SharedPlatformConstants
{
    public record PlatformEntry
    {
        public bool IsBigEndian { get; set; } = false;
        public bool IsLittleEndian => IsBigEndian == false;
        public string BizhawkIdentifier { get; set; } = string.Empty;
        public int? FrameSkipDefault { get; set; } = null;

        public PlatformMemoryLayoutEntry[] MemoryLayout { get; set; } = Array.Empty<PlatformMemoryLayoutEntry>();
    }

    public record PlatformMemoryLayoutEntry
    {
        public string BizhawkIdentifier { get; set; } = string.Empty;
        public int CustomPacketTransmitPosition { get; set; } = 0;
        public int Length { get; set; } = 0;

        public long PhysicalStartingAddress = 0x00;
        public long PhysicalEndingAddress => PhysicalStartingAddress + Length;
    }

    public static readonly IEnumerable<PlatformEntry> Information = new List<PlatformEntry>()
    {
        new PlatformEntry
        {
            IsBigEndian = true,
            BizhawkIdentifier = "NES",
            MemoryLayout = new PlatformMemoryLayoutEntry[]
            {
                new PlatformMemoryLayoutEntry
                {
                    BizhawkIdentifier = "RAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0x00,
                    Length = 0x800
                }
            }
        },
        new PlatformEntry
        {
            IsBigEndian = false,
            BizhawkIdentifier = "SNES",
            MemoryLayout = new PlatformMemoryLayoutEntry[]
            {
                new PlatformMemoryLayoutEntry
                {
                    BizhawkIdentifier = "WRAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0x7E0000,
                    Length = 0x10000
                }
            }
        },
        new PlatformEntry()
        {
            IsBigEndian = false,
            BizhawkIdentifier = "GB",
            MemoryLayout = new PlatformMemoryLayoutEntry[]
            {
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "WRAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0xC000,
                    Length = 0x2000
                },
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "VRAM",
                    CustomPacketTransmitPosition = 0x2000 + 1,
                    PhysicalStartingAddress = 0x8000,
                    Length = 0x1FFF
                },
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "HRAM",
                    CustomPacketTransmitPosition = 0x1000 + 0x1FFF + 1,
                    PhysicalStartingAddress = 0xFF80,
                    Length = 0x7E
                }
            }
        },
        new PlatformEntry()
        {
            IsBigEndian = false,
            BizhawkIdentifier = "GBC",
            MemoryLayout = new PlatformMemoryLayoutEntry[]
            {
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "WRAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0xC000,
                    Length = 0x2000
                },
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "VRAM",
                    CustomPacketTransmitPosition = 0x2000 + 1,
                    PhysicalStartingAddress = 0x8000,
                    Length = 0x1FFF
                },
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "HRAM",
                    CustomPacketTransmitPosition = 0x2000 + 0x1FFF + 1,
                    PhysicalStartingAddress = 0xFF80,
                    Length = 0x7E
                }
            }
        },
        new PlatformEntry
        {
            IsBigEndian = true,
            BizhawkIdentifier = "GBA",
            MemoryLayout = new PlatformMemoryLayoutEntry[]
            {
                new PlatformMemoryLayoutEntry
                {
                    BizhawkIdentifier = "EWRAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0x02000000,
                    Length = 0x00040000
                },
                new PlatformMemoryLayoutEntry
                {
                    BizhawkIdentifier = "IWRAM",
                    CustomPacketTransmitPosition = 0x00040000 + 1,
                    PhysicalStartingAddress = 0x03000000,
                    Length = 0x00008000
                }
            }
        },
        new PlatformEntry()
        {
            IsBigEndian = true,
            BizhawkIdentifier = "NDS",
            FrameSkipDefault = 15,
            MemoryLayout = new PlatformMemoryLayoutEntry[] {
                new PlatformMemoryLayoutEntry {
                    BizhawkIdentifier = "Main RAM",
                    CustomPacketTransmitPosition = 0,
                    PhysicalStartingAddress = 0x2000000,
                    Length = 0x400000
                }
            }
        }
    };
}
#endregion