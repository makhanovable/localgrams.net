# LocalGrams.net
https://github.com/makhanovable/localgrams.net
#### Running:
```
npm install
npm start
```

#### Create new wallet (POST):
```  
https://localgrams.net/api/wallet/new
```

##### Response Example:
```
{
    "code": 200,
    "message": "Wallet Created but not initialized",
    "data": {
        "balance": 0,
        "state": 0,
        "public_key": "8611c9dc7e78388ba9fb55d12946cd9d3582b12eaacc2794511697264145a9f6",
        "private_key": "cee8fbbab1faac7e823598f57b8b8fce944a7c202d0c106620de8a774f8b34de",
        "address": "EQAqUskYlC8AvkxBpCfryk80l1E7i5DA1tyGiEf96qW9VvWf"
    }
}
```

#### Get wallet balance (GET):
```
https://localgrams.net/api/wallet/balance?address=YOUR_ADDRESS_IN_BASE64_URL
```

##### Response Example:   
```
{
    "code": 200,
    "message": "Wallet balance",
    "data": {
        "state": 1,
        "balance": 1078536986
    }
}
```

#### Transfer GRAMS (POST): 
`Content-Type:  application/x-www-form-urlencoded`
```
https://localgrams.net/api/wallet/transfer
PARAMS:
    sender_public=PUBLIC_KEY_OF_SENDER
    sender_private=PRIVATE_KEY_OF_SENDER
    sender_address=ADDRESS_OF_SENDER_IN_BASE64_URL
    dest_address=ADDRESS_OF_DESTINATION_IN_BASE64_URL
    amount=AMOUNT_IN_NANOGRAMS
```

##### Response Example:   
```
{
    "code": 200,
    "message": "Success"
    "transaction": "2f094f4915c58154c2436634cc8b8fced06cb81bd1576993c3414ee1f2844841"
}
```

### Possible Wallet states:   
```
0 - uninitialized
1 - active
2 - frozen 
```
