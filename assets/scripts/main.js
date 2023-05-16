document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    const editBox = document.getElementById('editBox');
    const save = document.querySelector('.save');
    const userInput = document.getElementById('userInput');

    buttons.forEach((button) => {
        // When a Button is clicked, editBox appears
	button.addEventListener('click', () => {
		selectedButton = button;
		editBox.style.display = 'block';

        // When the save button is clicked, button's text is changed to the input from editBox
		save.addEventListener('click', () => {
			button.textContent = userInput.value;
			editBox.style.display = 'none';
		});

	 });
     });
});
