const config = {
  loginMethod: "identity", // self , identity
  tlvCoinsList: [
    {
      title: 'bitcoincash',
      coin: 'bch',
      price: '45,428.98',
      gain: '1',
      up: true,
      loss: 0.68,
      totalcoin: 1000,
      shortcode: 'USD'
    },
    {
      title: 'ethereum',
      coin: 'eth',
      price: '45,428.98',
      gain: '1',
      up: true,
      loss: 0.68,
      totalcoin: 1000,
      shortcode: 'ETH'
    },
    {
      title: 'Bitcoin',
      coin: 'btc',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: false,
      totalcoin: 1000,
      shortcode: 'BTC'
    },
    {
      title: 'Stellar',
      coin: 'xlm',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: true,
      totalcoin: 1000,
      shortcode: 'XLM'
    },
    {
      title: 'Us dollar',
      coin: 'usd-d',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: false,
      totalcoin: 1000,
      shortcode: 'USD'


    },
    {
      title: 'oxbtc',
      coin: 'oxbtc',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: true,
      totalcoin: 1000,
      shortcode: 'BTC'
    },
    {
      title: 'act',
      coin: 'act',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: true,
      totalcoin: 1000,
      shortcode: 'ADA'
    },
    {
      title: 'dat',
      coin: 'dat',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: true,
      totalcoin: 1000,
      shortcode: 'DAT'
    },
    {
      title: 'bitcoincash',
      coin: 'bch',
      price: '45,428.98',
      gain: '1',
      loss: 0.68,
      up: false,
      totalcoin: 4000,
      shortcode: 'BCH'
    }
  ],
  walletList: [
    {
      coin: 'usd-d',
      title: 'US Dollar Wallet',
      isArrow: true,
    },
    {
      coin: 'eur',
      title: 'Euro Wallet',
      isArrow: true,
    },
    {
      coin: 'gbp',
      title: 'Pound Sterlling Wallet',
      isArrow: true,
    }
  ]
}

export default config;