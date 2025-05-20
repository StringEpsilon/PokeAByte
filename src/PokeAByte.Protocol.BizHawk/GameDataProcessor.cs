using System;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using BizHawk.Common;
using BizHawk.Emulation.Common;
using PokeAByte.Protocol.BizHawk.PlatformData;

namespace PokeAByte.Protocol.BizHawk;

internal class GameDataProcessor : IDisposable
{
    private IMemoryDomains _memoryDomains { get; set; } = null!;

    private Label _mainLabel;
    private PlatformEntry _platform;
    private MemoryMappedViewAccessor _dataAccessor;
    private byte[] _writeBuffer;
    private DomainReadInstruction[] _readInstructions;
    private int _frameSkip;
    private int _skippedFrames;
    private byte[] DataBuffer { get; } = new byte[4 * 1024 * 1024];


    internal GameDataProcessor(
        IMemoryDomains memoryDomains,
        PlatformEntry platform,
        SetupInstruction setup,
        Label mainLabel
    )
    {
        _mainLabel = mainLabel;
        _memoryDomains = memoryDomains;
        _platform = platform;

        int totalSize = 0;
        var blocks = new ReadBlock[setup.BlockCount];
        _readInstructions = new DomainReadInstruction[blocks.Length];
        _frameSkip = setup.FrameSkip == -1 ? _platform.FrameSkipDefault : setup.FrameSkip;

        for (int i = 0; i < setup.BlockCount; i++)
        {
            var readBlock = setup.Data[i];
            var entry = _platform.Domains.First(x => x.Start <= readBlock.GameAddress && x.End >= readBlock.GameAddress + readBlock.Length);
            var address = readBlock.GameAddress - entry.Start;
            _readInstructions[i] = new DomainReadInstruction
            {
                Domain = entry.DomainId,
                TransferPosition = readBlock.Position,
                RelativeStart = address,
                RelativeEnd = address + readBlock.Length - 1,
            };
        }
        for (int i = 0; i < setup.BlockCount; i++)
        {
            totalSize += setup.Data[i].Length;
            blocks[i] = setup.Data[i];
        }
        if (totalSize == 0)
        {
            throw new InvalidDataException("Setup instruction came with invalid block sizes. ");
        }
        _dataAccessor = this.GetMMFAccessor(totalSize);
        _writeBuffer = new byte[totalSize];
        mainLabel.Text = $"Providing memory data ({totalSize} bytes) to client...";
    }


    private MemoryMappedViewAccessor GetMMFAccessor(int size)
    {
        MemoryMappedViewAccessor accessor;
        MemoryMappedFile memoryMappedFile;
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            memoryMappedFile = MemoryMappedFile.CreateOrOpen("EDPS_MemoryData.bin", size, MemoryMappedFileAccess.ReadWrite);
        }
        else
        {
            if (File.Exists("/dev/shm/EDPS_MemoryData.bin"))
            {
                File.Delete("/dev/shm/EDPS_MemoryData.bin");
            }
            memoryMappedFile = MemoryMappedFile.CreateFromFile(
                "/dev/shm/EDPS_MemoryData.bin",
                FileMode.OpenOrCreate,
                null,
                size,
                MemoryMappedFileAccess.ReadWrite
            );
        }
        accessor = memoryMappedFile.CreateViewAccessor();
        memoryMappedFile.Dispose();
        return accessor;
    }

    public void Update()
    {
        if (_skippedFrames > _frameSkip)
        {
            _skippedFrames = 0;
        }
        else
        {
            _skippedFrames++;
            return;
        }
        foreach (var instruction in _readInstructions)
        {
            try
            {
                var domain = _memoryDomains[instruction.Domain];
                if (domain != null)
                {
                    var length = instruction.RelativeEnd - instruction.RelativeStart;
                    domain.BulkPeekByte(instruction.RelativeStart.RangeToExclusive(instruction.RelativeEnd), DataBuffer);
                    Buffer.BlockCopy(DataBuffer, 0, _writeBuffer, (int)instruction.TransferPosition, (int)length);
                }
            }
            catch (Exception ex)
            {
                _mainLabel.Text = $"Error reading {instruction.RelativeStart:x2} in '{instruction.Domain}': {ex.Message}";
            }
        }
        _dataAccessor.WriteArray(0, _writeBuffer, 0, _writeBuffer.Length);
    }

    public void Dispose()
    {
        this._dataAccessor.Dispose();
        if (File.Exists("/dev/shm/EDPS_MemoryData.bin"))
        {
            File.Delete("/dev/shm/EDPS_MemoryData.bin");
        }
    }
}
