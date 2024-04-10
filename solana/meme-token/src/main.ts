import {
	createAndMint,
	mplTokenMetadata,
	TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
	generateSigner,
	keypairIdentity,
	percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { userKeypair } from "./helpers";

const umi = createUmi("https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);

umi.use(keypairIdentity(keypair)).use(mplTokenMetadata());

const metadata = {
	name: "Disappointed Fan",
	symbol: "DSF",
	uri: "",
};

async function createMemeCoin() {
	const mint = generateSigner(umi);

	const tx = await createAndMint(umi, {
		mint,
		name: metadata.name,
		symbol: metadata.symbol,
		isMutable: true,
		decimals: 9,
		uri: metadata.uri,
		sellerFeeBasisPoints: percentAmount(5.5),
		authority: umi.identity,
		amount: 10_000_000_000,
		tokenOwner: umi.identity.publicKey,
		tokenStandard: TokenStandard.Fungible,
	}).sendAndConfirm(umi);

	console.log(
		`token mint: https://explorer.solana.com/address/${mint}?cluster=devnet`
	);

	console.log(
		`tx sig: https://explorer.solana.com/tx/${tx.signature.toString()}?cluster=devnet `
	);

	return tx.signature;
}

createMemeCoin()
	.then()
	.catch((err) => console.log("error minting meme coin: ", err));
