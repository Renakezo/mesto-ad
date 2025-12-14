const showInputError = (formElement, errorMessage, inputElement, settings) => {
	const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
	inputElement.classList.add(settings.inputErrorClass)
	errorElement.textContent = errorMessage
	errorElement.classList.add(settings.errorClass)
}

const hideInputError = (formElement, inputElement, settings) => {
	const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
	inputElement.classList.remove(settings.inputErrorClass)
	errorElement.classList.remove(settings.errorClass)
	errorElement.textContent = ''
}

const checkInputValidity = (formElement, inputElement, settings) => {
	const nameRegex = /^[a-zA-Zа-яА-Я\s\-]+$/

	if (inputElement.validity.valid) {
		if (inputElement.dataset.errorMessage) {
			if (
				!nameRegex.test(inputElement.value) &&
				inputElement.value.length > 0
			) {
				showInputError(
					formElement,
					inputElement,
					inputElement.dataset.errorMessage,
					settings
				)
				return false
			}
		}
		hideInputError(formElement, inputElement, settings)
		return true
	} else {
		let errorMessage = inputElement.validationMessage
		if (
			inputElement.dataset.errorMessage &&
			!nameRegex.test(inputElement.value) &&
			inputElement.value.length > 0
		) {
			errorMessage = inputElement.dataset.errorMessage
		}

		showInputError(formElement, inputElement, errorMessage, settings)
		return false
	}
}

const hasInvalidInput = inputList => {
	return inputList.filter(x => !x.validity.valid).length != 0
}

const disableSubmitButton = (buttonElement, settings) => {
	buttonElement.setAttribute('disabled', false)
	buttonElement.classList.remove(settings.inactiveButtonClass)
}

const enableSubmitButton = (buttonElement, settings) => {
	buttonElement.setAttribute('disabled', true)
	buttonElement.classList.add(settings.inactiveButtonClass)
}

const toggleButtonState = (inputList, buttonElement, settings) => {
	if (hasInvalidInput(inputList)) {
		disableSubmitButton(buttonElement, settings)
	} else {
		enableSubmitButton(buttonElement, settings)
	}
}

const setEventListeners = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	)
	const buttonElement = formElement.querySelector(settings.submitButtonSelector)

	toggleButtonState(inputList, buttonElement, settings)

	inputList.forEach(inputElement => {
		inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, settings)
			toggleButtonState(inputList, buttonElement, settings)
		})
	})
}

export const clearValidation = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector)
	)
	const buttonElement = formElement.querySelector(settings.submitButtonSelector)

	inputList.forEach(inputElement => {
		hideInputError(formElement, inputElement, settings)
	})

	disableSubmitButton(buttonElement, settings)
}

export const enableValidation = settings => {
	const formList = Array.from(document.querySelectorAll(settings.formSelector))

	formList.forEach(formElement => {
		setEventListeners(formElement, settings)
	})
}
