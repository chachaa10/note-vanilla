// DOM Elements
const noteModal = document.getElementById("note-modal");
const closeModalButton = document.getElementById("close-modal");
const addNoteButton = document.getElementById("add-note-button");
const deleteNoteButton = document.getElementById("delete-note");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search-input");

// mock data with emojis
const mockNotes = [
    {
        id: "1",
        title: "Welcome to Note App",
        body: "made with ❤️",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Add Notes",
        body: "📝",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Edit Notes",
        body: "✏️",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        title: "Delete Notes",
        body: "🗑️",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// State Management
let currentNoteElement = null;
let originalNoteTitle = "";
let originalNoteBody = "";
let notes = []; // Array to hold all notes

// Local Storage Keys
const NOTES_STORAGE_KEY = "notes-app-notes";

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
    searchInput.value = "";
    originalNoteTitle = "";
    originalNoteBody = "";
    deleteNoteButton.style.display = "none";
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

/**
 * Creates a new note object with title, body, and timestamp.
 * @param {string} title - The title of the note.
 * @param {string} body - The body of the note.
 * @returns {object} The new note object.
 */
function createNoteObject(title, body) {
    const now = new Date().toISOString();
    return {
        id: crypto.randomUUID(),
        title,
        body,
        createdAt: now,
        updatedAt: now,
    };
}

/**
 * Creates a DOM element for a note.
 * @param {object} note - The note object.
 * @returns {HTMLElement} The created list item element.
 */
function createNoteElement(note) {
    const noteElement = document.createElement("li");
    noteElement.dataset.id = note.id;

    const createdDateFormatted = new Date(note.createdAt).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    let updatedDateFormatted = "";
    if (note.updatedAt && note.updatedAt !== note.createdAt) {
        updatedDateFormatted = new Date(note.updatedAt).toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    noteElement.innerHTML = `
        <h2 class="note-title">${note.title}</h2>
        <p class="note-body">${note.body}</p>
        <div class="dates">
            <p class="note-date">${createdDateFormatted ? `Created on: ${createdDateFormatted}` : ""}</p>
            <p class="note-updated-date">${updatedDateFormatted ? `Last updated: ${updatedDateFormatted}` : ""}</p>
        </div>
    `;
    return noteElement;
}

function renderNotes() {
    notesList.innerHTML = ""; // Clear existing notes

    // Sort notes by updated date in descending order
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    sortedNotes.forEach((note) => {
        const noteElement = createNoteElement(note);
        notesList.appendChild(noteElement);
    });
}

function saveNotes() {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);

    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    } else {
        notes = [...mockNotes];
        saveNotes(); // Save mock data to localStorage so it doesn’t load again
    }

    renderNotes();
}

function createNewNote() {
    const title = modalTitle.textContent.trim();
    const body = modalBody.textContent.trim();

    if (!title && !body) return;

    const newNote = createNoteObject(title, body);
    notes.push(newNote);
    saveNotes();
    renderNotes(); // Re-render to show new note and maintain sort order
}

function updateExistingNote() {
    const title = modalTitle.textContent.trim();
    const body = modalBody.textContent.trim();

    if (!currentNoteElement) return;

    const noteId = currentNoteElement.dataset.id;
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) return;

    // If both title and body are empty, delete the note
    if (!title && !body) {
        notes.splice(noteIndex, 1);
    } else {
        const note = notes[noteIndex];
        const titleChanged = title !== note.title;
        const bodyChanged = body !== note.body;

        if (titleChanged || bodyChanged) {
            note.title = title;
            note.body = body;
            note.updatedAt = new Date().toISOString(); // Update the timestamp
        }
    }
    saveNotes();
    renderNotes(); // Re-render to update the note and maintain sort order
}

function handleModalClose() {
    if (!currentNoteElement) {
        createNewNote();
    } else {
        updateExistingNote();
    }
    resetModal();
}

// Event Handlers
function handleNoteClick(event) {
    const noteElement = event.target.closest("li");
    if (!noteElement) return;

    const noteId = noteElement.dataset.id;
    const note = notes.find((n) => n.id === noteId);

    if (!note) return;

    currentNoteElement = noteElement; // Set the current note element for updates
    originalNoteTitle = note.title;
    originalNoteBody = note.body;

    modalTitle.textContent = note.title;
    modalBody.textContent = note.body;

    deleteNoteButton.style.display = "block";
    deleteNoteButton.addEventListener("click", () => deleteNote(noteId));

    openModal();
}

function deleteNote(noteId) {
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        saveNotes();
        renderNotes();
    }
    closeModal();
}

function handleSearchInput() {
    const searchTerm = searchInput.value.toLowerCase();
    const noteElements = notesList.querySelectorAll("li");

    noteElements.forEach((noteElement) => {
        const title = noteElement.querySelector(".note-title").textContent.toLowerCase();
        const body = noteElement.querySelector(".note-body").textContent.toLowerCase();
        const shouldShow = title.includes(searchTerm) || body.includes(searchTerm);
        noteElement.style.display = shouldShow ? "" : "none";
    });
}

function handleTitleKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        modalBody.focus();
    }
}

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

setupEventListeners();
loadNotes();
