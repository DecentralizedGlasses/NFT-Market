import { StringExpressionOperatorReturningBoolean } from 'mongoose';
import { logger } from '../utils/logger';

type MintArgs = {
    to: string;
    name?: string;
    description?: string;
    attributes?: Array<{ trait_type: string; value?: string | number }>;
}

const state = {
    nextTokenId: 1,
    owners: new Map<number, string>(),  // tokenId -> ownerId/Address
    uris: new Map<number, string>(),    // tokenId -> tokenURI
    contractAddress: '0xMockContractAddress',
}

export async function mintToken(args: MintArgs) {
    const tokenId = state.nextTokenId++;
    const tokenURI = `ipfs://mock/${tokenId}`;

    state.owners.set(tokenId, args.to);
    state.uris.set(tokenId, tokenURI);

    logger.info('[mock-chain] mintToken', { to: args.to, tokenId, tokenURI });
    return { tokenId, tokenURI, contractAddress: state.contractAddress };
}

export async function transferToken(tokenId: number, from: string, to: string) {
    const owner = state.owners.get(tokenId);
    if (!owner) {
        logger.warn('[mock-chain] transferToken: token not found', { tokenId });
        return { ok: false as const, reason: 'Token not found' as const };
    }
    state.owners.set(tokenId, to);
    logger.info('[mock-chain] transferToken', { tokenId, from, to });
    return { ok: true as const };
}

export async function getOwner(tokenId: number) {
    const owner = state.owners.get(tokenId) ?? null;
    logger.info('[mock-chain] getOwner', { tokenId, owner });
    return owner;
}

export async function getTokenURI(tokenId: number) {
    const uri = state.uris.get(tokenId) ?? null;
    logger.info('[mock-chain] getTokenURI', { tokenId, uri });
    return uri;
}