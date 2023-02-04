/* eslint-disable func-names */
const CUSTOM_SELECT = 'js-custom-select';
const SELECT_DROPDOWN_LIST = 'select-dropdown__list';
const SELECT_DROPDOWN = 'select-dropdown';
const SELECT_DROPDOWN_BUTTON = 'select-dropdown__button';
const SELECT_DROPDOWN_LIST_ITEM = 'select-dropdown__list-item';
const SELECT_INDICATOR = 'select-dropdown__indicator';
const ACTIVE_CLASS = 'active';

class CustomSelectElement {
	constructor() {
		this.select = document.getElementsByClassName(CUSTOM_SELECT);
		this.liElement = null;
		this.ulElement = null;
		this.optionValue = null;
		this.optionText = null;
		this.selectDropdown = null;
		this.elementParentSpan = null;
	}

	// Wrap the select element in a div
	wrapElement = (el, wrapper, i, placeholder) => {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);

		const realSelectNode = wrapper.querySelector(`.${CUSTOM_SELECT}`);
		const realSelectOptions = Array.from(realSelectNode.querySelectorAll('option'));
		const realSelectedOption = realSelectOptions.find((option) => option.selected);

		document.addEventListener('click', (e) => {
			const clickInside = wrapper.contains(e.target);
			const menu = wrapper.getElementsByClassName(SELECT_DROPDOWN_LIST);

			if (!clickInside && menu) {
				[...menu].forEach((item) => {
					item.classList.remove(ACTIVE_CLASS);

					// Remove the active class from the indicator element
					item.nextElementSibling.classList.remove(ACTIVE_CLASS);
				});
			}
		});

		const buttonElement = document.createElement('button');
		const selectDisplayValue = document.createElement('span');
		const selectDisplayPlaceholder = document.createTextNode(placeholder);
		const dropdownIndicator = document.createElement('span');

		this.ulElement = document.createElement('ul');

		buttonElement.setAttribute('data-value', '');
		buttonElement.setAttribute('type', 'button');
		wrapper.className = `${SELECT_DROPDOWN} ${SELECT_DROPDOWN}--${i}`;
		buttonElement.className = `${SELECT_DROPDOWN_BUTTON} ${SELECT_DROPDOWN_BUTTON}--${i}`;
		selectDisplayValue.className = `${SELECT_DROPDOWN} ${SELECT_DROPDOWN}--${i}`;
		dropdownIndicator.className = `${SELECT_INDICATOR} ${SELECT_INDICATOR}--${i}`;
		this.ulElement.className = `${SELECT_DROPDOWN_LIST} ${SELECT_DROPDOWN_LIST}--${i}`;
		this.ulElement.id = `${SELECT_DROPDOWN_LIST}-${i}`;

		wrapper.appendChild(buttonElement);
		selectDisplayValue.appendChild(selectDisplayPlaceholder);
		buttonElement.appendChild(selectDisplayValue);
		wrapper.appendChild(this.ulElement);
		wrapper.appendChild(dropdownIndicator);

		if (realSelectedOption) {
			realSelectNode.setAttribute('selected', 'selected');
			buttonElement.dataset.value = realSelectedOption.value;
			buttonElement.querySelector('.select-dropdown').textContent = realSelectedOption.innerText;
		}
	};

	selectElement = (id, valueToSelect) => {
		const element = document.getElementById(id);

		element.value = valueToSelect;
		element.setAttribute('selected', 'selected');
	};

	initialize() {
		const displayUl = (element) => {
			if (element.tagName === 'BUTTON') {
				this.selectDropdown = element.parentNode.getElementsByTagName('ul');

				for (let i = 0, len = this.selectDropdown.length; i < len; i++) {
					this.selectDropdown[i].classList.toggle(ACTIVE_CLASS);
					this.selectDropdown[i].nextSibling.classList.toggle(ACTIVE_CLASS);
				}
			} else if (element.tagName === 'LI') {
				const selectElement = element.parentNode.parentNode.getElementsByClassName(CUSTOM_SELECT)[0];
				const indicatorElement = selectElement.parentNode.querySelector('.select-dropdown__indicator');

				this.selectElement(selectElement.id, element.getAttribute('data-value'));
				this.elementParentSpan = element.parentNode.parentNode.getElementsByTagName('span');
				indicatorElement.classList.toggle(ACTIVE_CLASS);
				element.parentNode.classList.toggle(ACTIVE_CLASS);
				this.elementParentSpan[0].textContent = element.textContent;
				this.elementParentSpan[0].parentNode.setAttribute('data-value', element.getAttribute('data-value'));
			}
		};

		for (let k = 0, len = this.select.length; k < len; k++) {
			// Hide the select element
			this.select[k].style.display = 'none';

			// Wrap the select element in a div
			this.wrapElement(
				document.getElementById(this.select[k].id),
				document.createElement('div'),
				k,
				'');

			// Inside wrapped div, create the ul element with the li elements inside that will replicate the select element
			for (let i = 0; i < this.select[k].options.length; i++) {
				this.liElement = document.createElement('li');
				this.optionText = document.createTextNode(this.select[k].options[i].text);
				this.optionValue = this.select[k].options[i].value;
				this.liElement.setAttribute('data-value', this.optionValue);
				this.liElement.appendChild(this.optionText);
				this.liElement.className = SELECT_DROPDOWN_LIST_ITEM;
				this.ulElement.appendChild(this.liElement);

				const initialSelectedValue = [...this.select[k].options].find((option) => option.selected)?.value;
				const currentLiElements = this.ulElement.querySelectorAll('li');

				currentLiElements.forEach((li) => {
					if (li.dataset.value === initialSelectedValue) {
						li.classList.add('selected');
					} else {
						li.classList.remove('selected');
					}
				});

				this.liElement.addEventListener('click', (e) => {
					displayUl(e.target);

					const { value } = e.target.dataset;

					const liElements = e.target.parentNode.querySelectorAll('li');

					liElements.forEach((li) => {
						if (li.dataset.value === value) {
							li.classList.add('selected');
						} else {
							li.classList.remove('selected');
						}
					});

					const changeEvent = new Event('change');
					this.select[k].dispatchEvent(changeEvent);

					[...this.select[k].options].forEach((option) => {
						if (option.value === value) {
							option.setAttribute('selected', '');
						} else {
							option.removeAttribute('selected');
						}
					});
				}, false);
			}
		}

		const buttonSelect = document.getElementsByClassName(SELECT_DROPDOWN_BUTTON);

		for (let i = 0, len = buttonSelect.length; i < len; i++) {
			const dropdownIndicator = buttonSelect[i].parentNode.querySelector('.select-dropdown__indicator');

			dropdownIndicator.addEventListener('click', function (e) {
				e.preventDefault();
				displayUl(this.parentNode.querySelector('button'));
			}, false);

			buttonSelect[i].addEventListener('click', function (e) {
				e.preventDefault();

				// "this" keyword is always referring to the button element
				displayUl(this);
			}, false);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const select = new CustomSelectElement();
	select.initialize();
})
