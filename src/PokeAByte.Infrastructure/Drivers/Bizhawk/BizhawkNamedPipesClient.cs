using System.IO.Pipes;
using PokeAByte.Domain.Models;

namespace PokeAByte.Infrastructure.Drivers.Bizhawk;

public static class BizhawkNamedPipesClient
{
    public const string PipeName = "BizHawk_Named_Pipe";

    public static async Task WriteToBizhawk(MemoryContract<byte[]> contract, int timeoutMs = 100)
    {
        try
        {
            NamedPipeClientStream client = new(".",
                PipeName,
                PipeDirection.Out,
                PipeOptions.Asynchronous);
            var contractBytes = contract.Serialize();
            await client.ConnectAsync(timeoutMs);
            await client.WriteAsync(contractBytes,
                0,
                contractBytes.Length
            );
            client.Flush();
            client.Dispose();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

}