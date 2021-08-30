# W3F Open Grant Proposal

* **Project Name:** 
Moncon
* **Team Name:** 
 [Moncon](https://moncon.co/)
* **Payment Address:** 
0x000000000000000000000

## Project Overview :page_facing_up: 


### Overview

Moncon offers users and content creators new ways to pay for and monetize any type of content and digital asset (NFT content). Publishers can coin their own NFTs and market their content, while users can get quality content and propose a small reward to their favorite content creator.

### Project Details 
The project is developed based on Substrate 2.0 and Kusama. In its initial phase, a token (moncon) will be created with which all the micropayments of the ecosystem will be made, in phase two of the project publishers will be able to issue their own NFTs, and share their content on the platform, a smart way The contract will ensure that the author always has royalties for creative content.


 ### General architecture
 ![architecture](https://res.cloudinary.com/camicasii/image/upload/v1618413657/monco/Architecture_mthimn.png)

####  Substrate 2.0
+ **Moncon Token** :  Moncon native token, with which you can pay for all the services provided by the platform

 + **pallet store** :  is used to create and manage NFT assets.
 + **pallet nft** : is used to create and manage NFT assets.
 + **Front end**: provides web user interface so that everyone can interact with the moncon platform and any of its associated products.
 + **API** : custom api that allows full integration between the * ***Front end***  the subtrate2.0 and IPFS
 + **IPFS** : ipfs server, which enables decentralized storage of digital content


###  Publisher architecture

![Users architecture](https://res.cloudinary.com/camicasii/image/upload/v1618336032/monco/publisher_h5gewr.png)

1. Publishers will be able to upload digital content and turn it into a digital asset.

2. The  [Moncon](https://moncon.co/) website will have everything necessary for publishers to create their Nfts content, and facilitate all interaction with the kusama network, you will be able to see the scope of your digital content among your followers and analytics of your website, collect the commissions earned by the content shared between users.

3. The "moncon" smart contract will address business logic between users and publishers, making it easier for users and publishers to share tokenized digital content.
	 * mint token: moncon's smart contract allows users to create their own NFTs.
	 * sales order: the publisher places purchase orders that will be handled by moncon smart contract and will be available for purchase by any user.
	 * claim commission: publishers may claim the dividends obtained from the sale of their nfts content

4. Digital content will be enviara  the IPFS network, ensuring that digital content is always available at any time and for a long timeo.

### Users architecture

![Users architecture](https://res.cloudinary.com/camicasii/image/upload/v1618336032/monco/Users_veoxnm.png)

1. The user will be able to buy, share and manage the multimedia content that is available between their NFTs and buy new content at any time from any web portal.

2. The page contains plugins that allow the "website" to obtain functionalities to communicate with the Kusama network and the user can obtain and manage tokenized digital content (NFTs).

3. The "moncon" smart contract will address business logic between users and publishers, making it easier for users and publishers to share tokenized digital content.

	*  share content: share the nft content between users without commission.
	* available ntfs: Users can obtain the available nfts they own from the blockchain.
	*  buy order: the user will be able to interact with the Moncon smart sale contract, where they will be able to obtain their preferred NFT content.

4. Digital content will be assembled on the IPFS network, ensuring that digital content is always available at any time and for a long time.

#### Data Structure
![ Data Structure](https://res.cloudinary.com/camicasii/image/upload/v1618415202/monco/Data_Structure_on9u58.png)

As shown above, NFT design adopts ERC721 and ERC 1115 protocol, monco token is under ERC20 standard.
While the smart contract of moncon markeplace is designed for the purchase and sale of the Nfts of the users and publishers.

// nota // add repo of moncon smart contract 

### Ecosystem Fit 

 [Moncon](https://moncon.co/) will have its own ERC20 token, users will be able to pay and exchange their content and publishers will be able to receive their rewards and exchange them on any exchange of their choice or on the moncon platform


Help us locate your project in the Polkadot/Substrate/Kusama landscape and what problems it tries to solve by answering each of these questions:

* Where and how does your project fit into the ecosystem? 
* Who is your target audience (parachain/dapp/wallet/UI developers, designers, your own user base, some dapp's userbase, yourself)?
* What need(s) does your project meet? 
* Are there any other projects similar to yours in the Substrate / Polkadot / Kusama ecosystem? 
  * If so, how is your project different?
  * If not, are there similar projects in related ecosystems?

## Team :busts_in_silhouette:

### Team members
* Name of team leader
* Names of team members	

### Contact
* **Contact Name:** Full name of the contact person in your team
* **Contact Email:** Contact email (e.g. john@duo.com)
* **Website:**

### Legal Structure 
* **Registered Address:** Address of your registered legal entity, if available. Please keep it in a single line. (e.g. High Street 1, London LK1 234, UK)
* **Registered Legal Entity:** Name of your registered legal entity, if available. (e.g. Duo Ltd.)

### Team's experience
Please describe the team's relevant experience. If your project involves development work, we would appreciate it if you singled out a few interesting code commits made by team members in past projects. For research-related grants, references to past publications and projects in a related domain are helpful. 

If anyone on your team has applied for a grant at the Web3 Foundation previously, please list the name of the project and legal entity here.

### Team Code Repos
* https://github.com/<your_repo_1>
* https://github.com/<your_repo_2>

### Team LinkedIn Profiles
* https://www.linkedin.com/<person_1>
* https://www.linkedin.com/<person_2>

## Development Status :open_book: 
in progress

 * [Moncon](https://moncon.co/)


## Development Roadmap :nut_and_bolt: 

### Overview
* **Total Estimated Duration:**  2 meses
* **Full-Time Equivalent (FTE):** 2 FTE)
* **Total Costs:** Amount of payment in USD for the whole project. The total amount of funding _needs to be below $30k for initial grants_ and $100k for follow-up grants. (e.g. 12,000 USD)

### Milestone 1  Verify Production of Concepts (POC) and Implement Substrate 

* **Estimated Duration:** 1 month
* **FTE:**  2
* **Costs:** 8,000 USD


| Number | Deliverable | Specification |
| -----: | ----------- | ------------- |
| 0a. | License | Apache 2.0 / MIT / Unlicense |
| 0b. | Documentation | Documents containing the description of whole architecture design for Moncon NFTs|
| 0c. | Testing Guide | We will provide a full test suite and guide for NFT . | 
| 0d. | Article/Tutorial |	Complete the deployment of the basic public chain
| 1. | Token Moncon ERC20 | create a token to be usable for payments and services consumed by the community|
| 2. | Create NFTs Moncon | the publisher to create their own NTFS to share with the community.|
| 3. | Moncon Sales Smart Contract |create a smart contract that handles the logic between the community and publishers|  



### Milestone 2 Example — IPFS service implementation and web implementation

* **Estimated Duration:** 1 month
* **FTE:**  1
* **Costs:** 4,000 USD

| Number | Deliverable | Specification |
| -----: | ----------- | ------------- |
| 0a. | License | Apache 2.0 / MIT / Unlicense |
| 0b. | Documentation |Documents containing the complete architecture design description for the IPFS service|
| 0c. | Testing Guide | We will provide a complete test suite and a guide to the operation of the smart contract deployed on the Kusama network and the moncon platform web service.
| 0d. | Article/Tutorial |	Complete the deployment of the services|
| 1. | create IPFS services | create an api where the NFTS metadata is located|
| 2. | create custom API|API that will handle the requests to the IPFS server and some metadata|


## Future Plans

Please include here

- how you intend to use, enhance, promote and support your project in the short term, and
- the team's long-term plans and intentions in relation to it.


## Additional Information :heavy_plus_sign: 

Any additional information that you think is relevant to this application that hasn't already been included.

Possible additional information to include:

* Are there are any teams who have already contributed (financially) to your project?
* Do you have a community of users or open-source developers who are contributing to your project?
