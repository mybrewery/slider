"use strict";

var Slider = function(target) {
	this._position = -1;
	this._amount = 0;

	this._target = target;
	this._urls = this._extractImages(target);
	this._images = [];
	this._setupLayout(target);
	this.addMultiple(this._urls);
}

Slider.prototype = {

	add: function(src) {
		this._addIndicator(this._amount);
		this._addImage(src, this._amount);
		this.setPosition(0);

		this._amount++;
	},

	addMultiple: function(images) {
		this.tools.loop(images, function(image){
			this.add(image);
		}.bind(this))
	},

	setPosition: function(value) {
		value = (this._images.length + value) % this._images.length;
		console.log(value);

		this.tools.loop(this._images, function(image){
			image.classList.remove("slider-current");
		}.bind(this));

		this._images[value].classList.add("slider-current");

		this._position = value;
	},

	_extractImages: function(target) {
		var result = [];
		var images = target.querySelectorAll("img");

		for (var i = 0; i < images.length; i++) {
			result[i] = images[i].getAttribute("src");
			images[i].remove();
		}

		return result;
	},

	_wrapImage: function(image, index) {
		var wrapper = this.tools.create("div");
		wrapper.classList.add("image-wrapper");
		wrapper.setAttribute("data-index", index);
		wrapper.appendChild(image);

		return wrapper;
	},

	_addIndicator: function(index) {
		var indicator = this.tools.create("div");
		indicator.classList.add("slider-indicator");
		indicator.setAttribute("data-index", index);
		this._target.control.indicators.appendChild(indicator);
	},

	_addImage: function(src, index) {
		var image = this.tools.create("img");
		image.setAttribute("src", src);

		var wrappedImage = this._wrapImage(image, index);
		this._images.push(wrappedImage);
		this._target.slidesWrapper.appendChild(wrappedImage);
	},

	_setupLayout: function(target) {
		var slidesWrapper = this.tools.create("div");
		slidesWrapper.classList.add("slides-wrapper");

		var control = this.tools.create("div");
		control.classList.add("slider-control");
		this._setupControl(control);

		target.appendChild(slidesWrapper);
		target.appendChild(control);

		target.control = control;
		target.slidesWrapper = slidesWrapper;
	},

	/* control */
	_setupControl: function(control) {
		var prevButton = this.tools.create("div");
		prevButton.classList.add("slider-prev-button");
		prevButton.setAttribute("data-direction", "prev");

		var nextButton = this.tools.create("div");
		nextButton.classList.add("slider-next-button");
		nextButton.setAttribute("data-direction", "next");

		prevButton.addEventListener("click", this._onDirectionButtonClick.bind(this, prevButton));
		nextButton.addEventListener("click", this._onDirectionButtonClick.bind(this, nextButton));

		control.appendChild(prevButton);
		control.appendChild(nextButton);

		this._setupIndicators(control);
	},

	_setupIndicators: function(control) {
		var container = this.tools.create("div");
		container.classList.add("slider-indicators");
		control.indicators = container;

		control.appendChild(container);
	},

	_onDirectionButtonClick: function(button) {
		var direction = button.getAttribute("data-direction");
		console.log(direction);

		switch(direction) {
			case "next": 
				this.setPosition(this._position + 1);
			break;

			case "prev": 
				this.setPosition(this._position - 1);
			break;
		}
	},

	tools: {
		create: function(tag) {
			return document.createElement(tag);
		},

		loop: function(arr, callback) {
			for (var i = 0; i < arr.length; i++) {
				callback(arr[i], i);
			}
		}
	}
}