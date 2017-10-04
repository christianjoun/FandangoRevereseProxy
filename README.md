# Fandango API Proxy

These proxy provides clients to access Fandango APIs while not sharing the key. If you are not familiar with Fandango APIs, please see [Fandango Developers Page](https://developer.fandango.com).

### Requirements

* [Node.js](http://nodejs.org/)


### Installation


Installing node modules

```
npm install
```

### Running the API Proxy

```
npm start
```

The proxy starts listening on port `7575`

### Running the Test Cases

```
npm test
```

### Troubleshooting

1. Getting `{'error': 'no apikey'}` ?

	Make sure you have `apikey`	 param as part of the request. In case of GET request it would be in URL. In case of POST request it would be in request body.