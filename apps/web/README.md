# Web

The flow site implements:

- sign in with farcaster
- data console
- flow management
  - create and publish a flow.
  - track the status of a flow.
- trace management
  - track the trace of a flow.
- commission management
  - trance the status of commission
  - withdraw available comission of a user
- api key management
  - create / disable / enable an api key for integration.
- flow open api

## How To Run

## Integration

The example of API integration:

```ts
const apiKey = '****';
await axios.post(
  `${BASE_URL}api/p/flows`,
  {
    name: 'your flow name',
    cover: 'cover image url',
    input: {
      addressList: [
        { type: 'ERC20', address: '0x1234...', amount: '0.001' },
        { type: 'ERC721', address: '0x1234...', tokenId: '3' },
        {
          type: 'ERC1155',
          amount: '0.0001',
          address: '0x1234...',
          tokenId: '0'
        }
      ],
      price: '0.004'
    },
    creator: your_farcaster_id
    seller: '0x2a45***'
  },
  {
    headers: { Authorization: `Bearer ${apiKey}` }
  }
);
```
