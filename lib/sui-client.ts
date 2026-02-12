import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { PTBStructure } from './ai-agent';

const client = new SuiClient({
  url: getFullnodeUrl(process.env.SUI_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'),
});

export async function simulateTransaction(
  tx: Transaction,
): Promise<{ success: boolean; effects: any; error?: string }> {
  try {
    const txBytes = await tx.build({ client });
    const result = await client.dryRunTransactionBlock({
      transactionBlock: txBytes,
    });

    return {
      success: result.effects.status.status === 'success',
      effects: result.effects,
      error: result.effects.status.error,
    };
  } catch (error: any) {
    return {
      success: false,
      effects: null,
      error: error.message,
    };
  }
}

export function buildPTBFromStructure(ptbStructure: PTBStructure): Transaction {
  const tx = new Transaction();

  for (const command of ptbStructure.commands) {
    switch (command.type) {
      case 'moveCall':
        if (command.target) {
          const [packageId, module, func] = command.target.split('::');
          tx.moveCall({
            target: `${packageId}::${module}::${func}`,
            arguments: command.arguments.map((arg) => 
              typeof arg === 'string' ? tx.pure.string(arg) : tx.pure(arg)
            ),
            typeArguments: command.typeArguments || [],
          });
        }
        break;

      case 'splitCoins':
        const [coin, amounts] = command.arguments;
        tx.splitCoins(coin, amounts);
        break;

      case 'mergeCoins':
        const [destination, sources] = command.arguments;
        tx.mergeCoins(destination, sources);
        break;

      case 'transferObjects':
        const [objects, recipient] = command.arguments;
        tx.transferObjects(objects, recipient);
        break;
    }
  }

  // Set gas budget
  tx.setGasBudget(ptbStructure.gasEstimate);

  return tx;
}

export async function estimateGas(tx: Transaction): Promise<number> {
  try {
    const txBytes = await tx.build({ client });
    const dryRun = await client.dryRunTransactionBlock({
      transactionBlock: txBytes,
    });

    return Number(dryRun.effects.gasUsed.computationCost) +
           Number(dryRun.effects.gasUsed.storageCost);
  } catch {
    // Default estimate if dry run fails
    return 10_000_000; // 0.01 SUI
  }
}

export async function getObjectDetails(objectId: string) {
  try {
    return await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });
  } catch {
    return null;
  }
}

export { client };
