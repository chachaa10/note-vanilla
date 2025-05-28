const noteModal = document.getElementById("note-modal");
const closeModalButton = document.getElementById("close-modal");
const addNoteButton = document.getElementById("add-note-button");

addNoteButton.addEventListener("click", () => {
    noteModal.showModal();
    document.body.classList.add("no-scroll");
    noteModal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
    noteModal.close();
    document.body.classList.remove("no-scroll");
    noteModal.classList.add("hidden");
});

noteModal.addEventListener("click", (event) => {
    const dialogDimensions = noteModal.getBoundingClientRect();
    if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
    ) {
        noteModal.close();
        document.body.classList.remove("no-scroll");
        noteModal.classList.add("hidden");
    }
});

noteModal.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    noteModal.classList.add("hidden");
});
