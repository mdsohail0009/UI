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
      loss: 1,
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
  ],
  portfilioList: [
    {
      title: 'dat',
      coin: 'dat',
      gain: '5',
      loss: '1',
      up: true,
    },
    {
      title: 'bitcoincash',
      coin: 'bch',
      gain: '1',
      loss: '-1',
      up: false,
    },
    {
      title: 'oxbtc',
      coin: 'oxbtc',
      gain: '2',
      loss: '1',
      up: true,
    },
    {
      title: 'Us dollar',
      coin: 'usd-d',
      gain: '1',
      loss: '-5',
      up: false,
    }
  ],
  fiatList: [
    {
      title: 'USD',
      coin: 'usd-d',
      balance: '5,000.00',
      profit: '1.00',
      currency: '$',
    },
    {
      title: 'Eur',
      coin: 'eur',
      balance: '2,500.00',
      profit: '0.84',
      currency: '€',
    },
    {
      title: 'gbp',
      coin: 'gbp',
      balance: '2,500.00',
      profit: '0.72',
      currency: '£',
    }
  ]
}

export default config;