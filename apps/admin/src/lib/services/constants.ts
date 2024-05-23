export const USER_STORE_KEY = 'user';

export const commissionList = [
	{
		name: 'frame1',
		cover:
			'https://resources.smartlayer.network/smartcat/reources/images/e5fd0c706c4eb3cc7f4295797f91e02e.png',

		hash: '0x23443333',
		ts: 1715262769,
		commission: '0.0001 ETH'
	},

	{
		name: 'frame2',
		cover:
			'https://i.seadn.io/gcs/files/b268f5141e6986aaf4f17c9ad42c4410.png?auto=format&dpr=1&w=1000',
		hash: '0x23443333',
		ts: 1717292769,
		commission: '0.0002 ETH'
	},

	{
		name: 'frame3',
		cover:
			'https://i.seadn.io/gcs/files/946fe689776ce7ae8ca40c3778d2f4e4.png?auto=format&dpr=1&w=1000',
		hash: '0x23443333',
		ts: 1719268769,
		commission: '0.0003 ETH'
	}
];

export const statistics = [
	{ title: 'Published', count: `${Math.floor(Math.random() * 100)}M+` },
	{ title: 'Running', count: `${Math.floor(Math.random() * 100)}M+` },
	{ title: 'Dealed', count: `${Math.floor(Math.random() * 100)}K+` }
];

export const WARP_BASE = 'https://warpcast.com/';

export const frameList = [
	{
		name: 'Trade volume',
		count: '23,444',
		color: '#fee4cb'
	},
	{
		name: 'Unique fids',
		count: '171,729',
		color: '#d1d5db'
	}
];
