// Upon Page load, call activateSidebarHandler()
document.addEventListener('DOMContentLoaded', () => {
  activateSidebarHandler();
});

// If any button is clicked in the sidebar, call editFortuneBox(button), which takes an argument of the button that was clicked
function activateSidebarHandler() {
  const sidebarButtons = document.querySelectorAll('.sidebarButton');

  sidebarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      editFortune(button);
    });
  });
}

// Make the editFortuneBox appear, allow the user to write in their own fortune, and change the text of the button that was passed in
function editFortune(button) {
  const editFortuneBox = document.getElementById('editFortuneBox');
  const saveButton = document.querySelector('.saveButton');
  const userInput = document.getElementById('userInput');

  editFortuneBox.style.display = 'block';

  saveButton.addEventListener('click', () => {
    button.textContent = userInput.value;
    editFortuneBox.style.display = 'none';
  });
}
