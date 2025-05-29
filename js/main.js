const noteModal = document.getElementById("note-modal");
const closeModalButton = document.getElementById("close-modal");
const addNoteButton = document.getElementById("add-note-button");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search-input");

let currentNoteElement = null;
let originalNoteTitle = "";
let originalNoteBody = "";

// Function to reset the modal
function resetModal() {
    modalTitle.textContent = "";
    modalBody.textContent = "";
    currentNoteElement = null;
    originalNoteTitle = "";
    originalNoteBody = "";
}

addNoteButton.addEventListener("click", () => {
    resetModal();
    noteModal.showModal();
    document.body.classList.add("no-scroll");
    noteModal.classList.remove("hidden");
    modalTitle.focus();
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

    const newTitle = modalTitle.textContent.trim();
    const newBody = modalBody.textContent.trim();

    if (!currentNoteElement) {
        if (newTitle || newBody) {
            // Only create if there's content
            createNote(newTitle, newBody);
        }
    }

    if (!newTitle || !newBody) {
        currentNoteElement.remove();
    }

    // Only update if there's content
    currentNoteElement.querySelector(".note-title").textContent = newTitle;
    currentNoteElement.querySelector(".note-body").textContent = newBody;

    // We are editing an existing note
    // Check if content has actually changed
    const contentChanged = newTitle !== originalNoteTitle || newBody !== originalNoteBody;
    if (contentChanged) {
        // Call updateDate only if content has changed
        updateDate(currentNoteElement);
    }

    resetModal();
});

modalTitle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        modalBody.focus();
    }
});

// Function to update the last updated date for a specific note element
function updateDate(noteElement) {
    const updatedDateElement = noteElement.querySelector(".note-updated-date");
    const updatedDate = new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    updatedDateElement.textContent = `Last updated: ${updatedDate}`;
}

function createNote(title, body) {
    const note = document.createElement("li");
    const currentDate = new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    note.innerHTML = `
        <h2 class="note-title">${title}</h2>
        <p class="note-body">${body}</p>
        <div class="dates">
            <p class="note-date">Created on: ${currentDate}</p>
            <p class="note-updated-date"></p> </div>
    `;
    notesList.appendChild(note);
}

// Open and Edit note
notesList.addEventListener("click", (event) => {
    const note = event.target.closest("li");
    if (note) {
        currentNoteElement = note; // Store the reference to the note being edited

        originalNoteTitle = note.querySelector(".note-title").textContent; // Store original title
        originalNoteBody = note.querySelector(".note-body").textContent; // Store original body

        modalTitle.textContent = originalNoteTitle;
        modalBody.textContent = originalNoteBody;

        noteModal.showModal();
        document.body.classList.add("no-scroll");
        noteModal.classList.remove("hidden");
    }
});

// Basic Search functionality (Optional, but good to have)
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = notesList.querySelectorAll("li");

    notes.forEach((note) => {
        const title = note.querySelector(".note-title").textContent.toLowerCase();
        const body = note.querySelector(".note-body").textContent.toLowerCase();

        if (title.includes(searchTerm) || body.includes(searchTerm)) {
            note.style.display = ""; // Show note
        } else {
            note.style.display = "none"; // Hide note
        }
    });
});
