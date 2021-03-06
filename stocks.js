
"use strict";


Module.register("stocks", {

	result: [],
	// Default module config.
	defaults: {
		stocks: "MSFT,AAPL,GOOG,INTC",
		updateInterval: 60000
	},

	getStyles: function() {
		return ["stocks.css"];
	},

	start: function() {
		this.getStocks();
		this.scheduleUpdate();
	},

	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("marquee");
		wrapper.className = "xxlarge bold bright";
		wrapper.setAttribute("style", "padding-top: 50px");

		var count = 0;
		var _this = this;

		if (this.result.length > 0){
			this.result.forEach(function(stock) {
				var symbolElement =  document.createElement("span");
				var symbol = stock.symbol;
				var lastPrice = stock.latestPrice;
				var changePercentage = stock.changePercent;
				var changeValue = stock.change;
				var lastClosePrice = stock.close;
				var lastPriceFix = stock.latestPrice;

				symbolElement.innerHTML = "<font color=yellow>" + symbol + " ";
				wrapper.appendChild(symbolElement);

				var priceElement = document.createElement("span");
				priceElement.innerHTML = lastPrice;

				var changeElement = document.createElement("span");

				var change = Math.abs(changeValue, -2);

				if (changePercentage > 0) {
					changeElement.className = "up";
					changeElement.innerHTML = " " + "&nbsp;" + "<img class = image src='modules/stocks/images/arrow_up.png' height='60' style='vertical-align=middle'>" + "&nbsp;" + change;
				} else {
					changeElement.className = "down";
					changeElement.innerHTML = " " + "&nbsp;" + "<img class = image src='modules/stocks/images/arrow_down.png' height='60' style='vertical-align=middle'>" + "&nbsp;" + change;
				}

				var divider = document.createElement("span");

				if (count < _this.result.length - 1)
				{divider.innerHTML = "&nbsp;" + " • " + "&nbsp;";}

				wrapper.appendChild(priceElement);
				wrapper.appendChild(changeElement);
				wrapper.appendChild(divider);
				count++;
			});

		}

		return wrapper;
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setInterval(function() {
			self.getStocks();
		}, nextLoad);
	},

	roundValue: function(value) {
		return Math.round(value*100)/100;
	},

	getStocks: function () {
		var url = "https://api.iextrading.com/1.0/stock/" //aapl/quote";

		var requestUrls = [];
		var stocksArray = this.config.stocks.split(",");

		stocksArray.forEach(function(stock) {
			var requestUrl = url + stock + "/quote";
			requestUrls.push(requestUrl);
		});

		this.sendSocketNotification("GET_STOCKS_MULTI", requestUrls);

	},


	socketNotificationReceived: function(notification, payload) {
		if (notification === "STOCKS_RESULT") {
			this.result = payload;
			this.updateDom(self.config.fadeSpeed);
		}
	},

});
