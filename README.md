# Eco ID App
This app is designed to allow community members to claim their Eco IDs that represent their identities within the ECOsystem. Users can create an Eco ID for each social account (Twitter, Discord) on which they are part of the ECOmmunity. Eco IDs are unique, non-transferrable NFTs which will later enable their users to claim an amount of Eco and ECOx corresponding to their points balances on their respective socials.
Users must first connect a web3 wallet to interact with the app by clicking Connect Wallet.
Once connected, users can who verify their social accounts. Verified users are then able to claim their Eco IDs.

## Getting Started

After cloning the repo, run npm install to install all required packages.

Next, be sure to set the required environment variables, notably the claim contract address. See .env.example for more details.

To run the app locally:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration
In order to sync to a specific deployment of contracts, this app requires the following to be set up:

#### Environment
Use the env variable `NEXT_PUBLIC_ENVIRONMENT` to set the directory that the app will use when fetching the points from the [assets folder](./assets/). Use either `development`, `staging`, or `production`.

#### Chain
Use the env variable `NEXT_PUBLIC_CHAIN` to set the network that the app will allow users to connect on, (examples: `mainnet`, `goerli`, `localhost`)

#### Verifier URI
the endpoint that the [nft-verifier](https://github.com/eco-association/nft-verifier) is running at. After a user is redirected to the twitter/discord oauth page and approves the app to use their account, they will be redirected to the specifed env variable `NEXT_PUBLIC_VERIFIER_URI` + `/api/v1/verify`.

#### Discord/Twitter Application Client ID's
Set the `NEXT_PUBLIC_DISCORD_CLIENT_ID` and `NEXT_PUBLIC_TWITTER_CLIENT_ID`, which should match the same applications that your verifier is running in order for the oauth flow to work.

#### Subgraph URI
This app uses the [nft-subgraph](https://github.com/eco-association/nft-subgraph) to get information about the EcoID and EcoClaim contracts, wherever the subgraph can be accessed for queries, assign that endpoint to the `NEXT_PUBLIC_SUBGRAPH_URI` env variable. The EcoID contract that the subgraph points to should match with the address that the verifier is using.

#### Points file
Although the points DB is not needed in order to register and will not break the app if incorrect, it is important to show users the correct amount of points that belong to them after they mint. Please ensure that the [`assets/points.json`](./assets/points.json) file is up to date for the deployment you are using.

## Deployment

To build the site to static files:
```bash
npm run build
# or 
yarn build
```

then access the static files in the `out/` folder

there will also be a nextjs optimized production build that can be run in the `.next/` folder that can be run with:
```bash
npm start
# or
yarn start
``` 

## Contributing
Contributions are welcome. Please submit any issues as issues on GitHub, and open a pull request with any contributions.

## License
[MIT (c) Helix Foundation](./LICENSE)
