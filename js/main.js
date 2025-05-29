// DOM Elements
const noteModal = document.getElementById("note-modal");
const closeModalButton = document.getElementById("close-modal");
const addNoteButton = document.getElementById("add-note-button");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search-input");

// State Management
let currentNoteElement = null;
let originalNoteTitle = "";
let originalNoteBody = "";

// Modal Functions
function openModal() {
    noteModal.showModal();
    document.body.classList.add("no-scroll");
    noteModal.classList.remove("hidden");
    modalTitle.focus();
}

function closeModal() {
    noteModal.close();
    document.body.classList.remove("no-scroll");
    noteModal.classList.add("hidden");
}

function resetModal() {
    modalTitle.textContent = "";
    modalBody.textContent = "";
    currentNoteElement = null;
    originalNoteTitle = "";
    originalNoteBody = "";
}

function handleModalClick(event) {
    const dialogDimensions = noteModal.getBoundingClientRect();
    const isOutsideClick =
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom;

    if (isOutsideClick) {
        closeModal();
    }
}

// Note Functions
function createNoteElement(title, body) {
    const note = document.createElement("li");
    const createdDate = new Date().toLocaleString("en-US", {
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
            <p class="note-date">Created on: ${createdDate}</p>
            <p class="note-updated-date"></p>
        </div>
    `;
    return note;
}

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

function createNewNote() {
    const title = modalTitle.textContent.trim();
    const body = modalBody.textContent.trim();

    if (!title && !body) return;

    const noteElement = createNoteElement(title, body);
    notesList.appendChild(noteElement);
}

function updateExistingNote() {
    const title = modalTitle.textContent.trim();
    const body = modalBody.textContent.trim();

    if (!title || !body) {
        currentNoteElement.remove();
        return;
    }

    const titleChanged = title !== originalNoteTitle;
    const bodyChanged = body !== originalNoteBody;

    if (titleChanged || bodyChanged) {
        currentNoteElement.querySelector(".note-title").textContent = title;
        currentNoteElement.querySelector(".note-body").textContent = body;
        updateDate(currentNoteElement);
    }
}

function handleModalClose() {
    if (!currentNoteElement) {
        createNewNote();
    }

    updateExistingNote();
    resetModal();
}

// Event Handlers
function handleNoteClick(event) {
    const noteElement = event.target.closest("li");
    if (!noteElement) return;

    currentNoteElement = noteElement;
    originalNoteTitle = noteElement.querySelector(".note-title").textContent;
    originalNoteBody = noteElement.querySelector(".note-body").textContent;

    modalTitle.textContent = originalNoteTitle;
    modalBody.textContent = originalNoteBody;
    openModal();
}

function handleSearchInput() {
    const searchTerm = searchInput.value.toLowerCase();
    const notes = notesList.querySelectorAll("li");

    notes.forEach((note) => {
        const title = note.querySelector(".note-title").textContent.toLowerCase();
        const body = note.querySelector(".note-body").textContent.toLowerCase();
        const shouldShow = title.includes(searchTerm) || body.includes(searchTerm);
        note.style.display = shouldShow ? "" : "none";
    });
}

function handleTitleKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        modalBody.focus();
    }
}

// Event Listeners
function setupEventListeners() {
    addNoteButton.addEventListener("click", () => {
        resetModal();
        openModal();
    });

    closeModalButton.addEventListener("click", closeModal);
    noteModal.addEventListener("click", handleModalClick);
    noteModal.addEventListener("close", handleModalClose);
    modalTitle.addEventListener("keydown", handleTitleKeydown);
    notesList.addEventListener("click", handleNoteClick);
    searchInput.addEventListener("input", handleSearchInput);
}

// Initialize
setupEventListeners();
