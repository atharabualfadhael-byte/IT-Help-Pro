const STORAGE_KEY = "itHelpProTickets";

let tickets = loadTickets();

/* =========================================================
   TROUBLESHOOTING DATA
========================================================= */

const troubleshootingData = {

    internet: {

        title: "Internet Troubleshooting",

        steps: [
            "Check that the network cable or Wi-Fi connection is active.",
            "Verify the device has a valid IP address and default gateway.",
            "Test connectivity with a known website or use ping to test the gateway.",
            "Check DNS settings and try a public DNS server if appropriate.",
            "Restart the network adapter or router if the issue remains."
        ]

    },


    computer: {

        title: "Computer Performance Troubleshooting",

        steps: [
            "Open Task Manager and review CPU, Memory and Disk usage.",
            "Close applications that are consuming excessive resources.",
            "Review startup applications and disable unnecessary items.",
            "Check available disk space and remove unnecessary files.",
            "Restart the computer and verify whether performance improves."
        ]

    },


    windows: {

        title: "Windows Troubleshooting",

        steps: [
            "Record the exact error message or code.",
            "Check Event Viewer for related application or system errors.",
            "Verify important Windows services are running.",
            "Install pending Windows updates when appropriate.",
            "Restart the device and test the affected function again."
        ]

    },


    printer: {

        title: "Printer Troubleshooting",

        steps: [
            "Confirm the printer is powered on and connected.",
            "Check the print queue for paused or stuck jobs.",
            "Verify the correct printer is selected as the default printer.",
            "Check printer drivers and run a test page.",
            "Restart the Print Spooler service if printing remains blocked."
        ]

    }

};


/* =========================================================
   LOAD TICKETS
========================================================= */

function loadTickets() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(saved)
            ? saved
            : [];

    } catch (error) {

        console.error(
            "Could not load tickets",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE TICKETS
========================================================= */

function saveTickets() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tickets)
    );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.toggle(
                "active-page",
                section.dataset.pageSection === page
            );

        });


    document
        .querySelectorAll(".menu button[data-page]")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        });


    const titles = {

        dashboard: "Dashboard",
        create: "Create Ticket",
        history: "Ticket History",
        search: "Search Ticket",
        knowledge: "Knowledge Base",
        troubleshooting: "Troubleshooting"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[page] || "Dashboard";


    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {
        sidebar.classList.remove("open");
    }


    if (page === "dashboard") {
        updateDashboard();
    }


    if (page === "history") {
        renderHistory();
    }

}


/* =========================================================
   QUICK TICKET
========================================================= */

function quickTicket(category) {

    openPage("create");


    document.getElementById(
        "category"
    ).value = category;


    const issueTypeMap = {

        Network: "Network Issue",
        Computer: "Hardware Issue",
        Windows: "Technical Issue",
        Account: "Access Issue"

    };


    document.getElementById(
        "issueType"
    ).value =
        issueTypeMap[category] || "";

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .querySelectorAll(
                ".menu button[data-page]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        openPage(
                            button.dataset.page
                        );

                    }
                );

            });


        const ticketForm =
            document.getElementById("ticketForm");

        if (ticketForm) {

            ticketForm.addEventListener(
                "submit",
                createTicket
            );

        }


        const mobileBtn =
            document.getElementById("mobileBtn");

        if (mobileBtn) {

            mobileBtn.addEventListener(
                "click",
                () => {

                    document
                        .getElementById("sidebar")
                        .classList.toggle("open");

                }
            );

        }


        const themeBtn =
            document.getElementById("themeBtn");

        if (themeBtn) {

            themeBtn.addEventListener(
                "click",
                toggleTheme
            );

        }


        const searchInput =
            document.getElementById("searchInput");

        if (searchInput) {

            searchInput.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {
                        searchTicket();
                    }

                }
            );

        }


        updateDashboard();

        renderHistory();

    }
);


/* =========================================================
   CREATE TICKET
========================================================= */

function createTicket(event) {

    event.preventDefault();


    const ticket = {

        id: generateTicketId(),

        requester:
            document
                .getElementById("requester")
                .value
                .trim(),

        issueTitle:
            document
                .getElementById("issueTitle")
                .value
                .trim(),

        category:
            document
                .getElementById("category")
                .value,

        issueType:
            document
                .getElementById("issueType")
                .value,

        priority:
            document
                .getElementById("priority")
                .value,

        contact:
            document
                .getElementById("contact")
                .value,

        description:
            document
                .getElementById("description")
                .value
                .trim(),

        status: "Open",

        date:
            new Date().toLocaleString()

    };


    tickets.unshift(ticket);

    saveTickets();

    updateDashboard();

    renderHistory();


    const generatedId =
        document.getElementById("generatedId");

    if (generatedId) {
        generatedId.textContent = ticket.id;
    }


    const modal =
        document.getElementById("modalOverlay");

    if (modal) {
        modal.classList.add("show");
    }


    resetForm();

}


/* =========================================================
   GENERATE TICKET ID
========================================================= */

function generateTicketId() {

    let id;


    do {

        id =
            `IT-${Math.floor(
                1000 + Math.random() * 9000
            )}`;

    } while (
        tickets.some(
            ticket => ticket.id === id
        )
    );


    return id;

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    const form =
        document.getElementById("ticketForm");

    if (form) {
        form.reset();
    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById("modalOverlay");

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =========================================================
   CLEAR TICKETS
========================================================= */

function clearTickets() {

    if (!tickets.length) {
        return;
    }


    const confirmed =
        confirm(
            "Clear all ticket history?"
        );


    if (!confirmed) {
        return;
    }


    tickets = [];

    saveTickets();

    updateDashboard();

    renderHistory();

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        tickets.length;


    const open =
        tickets.filter(
            ticket =>
                ticket.status === "Open"
        ).length;


    const progress =
        tickets.filter(
            ticket =>
                ticket.status === "In Progress"
        ).length;


    const resolved =
        tickets.filter(
            ticket =>
                ticket.status === "Resolved"
        ).length;


    const totalCount =
        document.getElementById("totalCount");

    const openCount =
        document.getElementById("openCount");

    const progressCount =
        document.getElementById("progressCount");

    const resolvedCount =
        document.getElementById("resolvedCount");


    if (totalCount) {
        totalCount.textContent = total;
    }

    if (openCount) {
        openCount.textContent = open;
    }

    if (progressCount) {
        progressCount.textContent = progress;
    }

    if (resolvedCount) {
        resolvedCount.textContent = resolved;
    }


    /* =========================
       RECENT TICKETS
    ========================== */

    const recentTable =
        document.getElementById("recentTable");


    if (!recentTable) {
        return;
    }


    if (!tickets.length) {

        recentTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty">

                    No tickets yet.

                </td>

            </tr>

        `;

    } else {

        recentTable.innerHTML =
            tickets
                .slice(0, 6)
                .map(ticket => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(ticket.id)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(ticket.issueTitle)}
                        </td>

                        <td>
                            ${escapeHtml(ticket.category)}
                        </td>

                        <td>
                            ${priorityBadge(ticket.priority)}
                        </td>

                        <td>
                            ${statusBadge(ticket.status)}
                        </td>

                    </tr>

                `)
                .join("");

    }


    /* =========================
       SUPPORT ACTIVITY
    ========================== */

    const activityList =
        document.getElementById("activityList");


    if (!activityList) {
        return;
    }


    if (!tickets.length) {

        activityList.innerHTML = `

            <div class="empty">
                No support activity yet.
            </div>

        `;

    } else {

        activityList.innerHTML =
            tickets
                .slice(0, 4)
                .map(ticket => `

                    <div class="activity-item">

                        <div>

                            <strong>
                                ${escapeHtml(ticket.id)}
                                ·
                                ${escapeHtml(ticket.issueTitle)}
                            </strong>

                            <small>
                                ${escapeHtml(ticket.category)}
                                ·
                                ${escapeHtml(ticket.date)}
                            </small>

                        </div>

                        ${statusBadge(ticket.status)}

                    </div>

                `)
                .join("");

    }

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

    const table =
        document.getElementById("ticketTable");

    const count =
        document.getElementById("historyCount");


    if (!table || !count) {
        return;
    }


    count.textContent =
        `${tickets.length} ticket${
            tickets.length === 1
                ? ""
                : "s"
        }`;


    if (!tickets.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No tickets have been submitted.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        tickets
            .map(ticket => `

                <tr>

                    <td>

                        <strong>
                            ${escapeHtml(ticket.id)}
                        </strong>

                    </td>


                    <td>
                        ${escapeHtml(ticket.issueTitle)}
                    </td>


                    <td>
                        ${escapeHtml(ticket.category)}
                    </td>


                    <td>
                        ${priorityBadge(ticket.priority)}
                    </td>


                    <td>

                        <select
                            onchange="updateTicketStatus('${ticket.id}', this.value)"
                            style="
                                padding:7px 9px;
                                border:1px solid #e5e7eb;
                                border-radius:7px;
                            ">

                            <option
                                value="Open"
                                ${ticket.status === "Open" ? "selected" : ""}>

                                Open

                            </option>


                            <option
                                value="In Progress"
                                ${ticket.status === "In Progress" ? "selected" : ""}>

                                In Progress

                            </option>


                            <option
                                value="Resolved"
                                ${ticket.status === "Resolved" ? "selected" : ""}>

                                Resolved

                            </option>

                        </select>

                    </td>


                    <td>
                        ${escapeHtml(ticket.date)}
                    </td>


                    <td>

                        <button
                            class="action-btn"
                            onclick="deleteTicket('${ticket.id}')">

                            Delete

                        </button>

                    </td>

                </tr>

            `)
            .join("");

}


/* =========================================================
   UPDATE STATUS
========================================================= */

function updateTicketStatus(id, status) {

    const ticket =
        tickets.find(
            item => item.id === id
        );


    if (!ticket) {
        return;
    }


    ticket.status = status;

    saveTickets();

    updateDashboard();

    renderHistory();

}


/* =========================================================
   DELETE TICKET
========================================================= */

function deleteTicket(id) {

    const confirmed =
        confirm(
            `Delete ${id}?`
        );


    if (!confirmed) {
        return;
    }


    tickets =
        tickets.filter(
            ticket =>
                ticket.id !== id
        );


    saveTickets();

    updateDashboard();

    renderHistory();

}


/* =========================================================
   SEARCH TICKET
========================================================= */

function searchTicket() {

    const input =
        document.getElementById("searchInput");

    const result =
        document.getElementById("searchResult");


    if (!input || !result) {
        return;
    }


    const value =
        input.value
            .trim()
            .toUpperCase();


    if (!value) {

        result.innerHTML = `

            <div class="empty">
                Enter a Ticket ID.
            </div>

        `;

        return;

    }


    const ticket =
        tickets.find(
            item =>
                item.id.toUpperCase() === value
        );


    if (!ticket) {

        result.innerHTML = `

            <div class="empty">

                No ticket found for
                <strong>
                    ${escapeHtml(value)}
                </strong>.

            </div>

        `;

        return;

    }


    result.innerHTML = `

        <div class="result-box">

            <div class="result-grid">


                <div class="result-item">

                    <span>
                        Ticket ID
                    </span>

                    <strong>
                        ${escapeHtml(ticket.id)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${statusBadge(ticket.status)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Requester
                    </span>

                    <strong>
                        ${escapeHtml(ticket.requester)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Issue
                    </span>

                    <strong>
                        ${escapeHtml(ticket.issueTitle)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Category
                    </span>

                    <strong>
                        ${escapeHtml(ticket.category)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Priority
                    </span>

                    <strong>
                        ${priorityBadge(ticket.priority)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Contact
                    </span>

                    <strong>
                        ${escapeHtml(ticket.contact)}
                    </strong>

                </div>


                <div class="result-item">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${escapeHtml(ticket.date)}
                    </strong>

                </div>


                <div
                    class="result-item"
                    style="grid-column:1/-1">

                    <span>
                        Description
                    </span>

                    <strong>
                        ${escapeHtml(ticket.description)}
                    </strong>

                </div>


            </div>

        </div>

    `;

}


/* =========================================================
   KNOWLEDGE BASE SEARCH
========================================================= */

function filterKnowledge() {

    const input =
        document.getElementById("kbSearch");


    if (!input) {
        return;
    }


    const query =
        input.value
            .trim()
            .toLowerCase();


    document
        .querySelectorAll(".kb")
        .forEach(card => {

            const text =
                `${card.dataset.search} ${card.textContent}`
                    .toLowerCase();


            card.classList.toggle(
                "hidden",
                query !== "" &&
                !text.includes(query)
            );

        });

}


/* =========================================================
   TROUBLESHOOTING
========================================================= */

function showTrouble(type) {

    const data =
        troubleshootingData[type];


    if (!data) {
        return;
    }


    const title =
        document.getElementById("troubleTitle");

    const steps =
        document.getElementById("troubleSteps");


    if (!title || !steps) {
        return;
    }


    title.textContent =
        data.title;


    steps.innerHTML = `

        <ol class="steps">

            ${data.steps
                .map(
                    step =>
                        `<li>${escapeHtml(step)}</li>`
                )
                .join("")}

        </ol>

    `;

}


/* =========================================================
   PRIORITY BADGE
========================================================= */

function priorityBadge(priority) {

    const className =
        String(
            priority || ""
        ).toLowerCase();


    return `

        <span class="priority ${className}">

            ${escapeHtml(
                priority || "-"
            )}

        </span>

    `;

}


/* =========================================================
   STATUS BADGE
========================================================= */

function statusBadge(status) {

    const classMap = {

        Open: "open",

        "In Progress": "progress",

        Resolved: "resolved"

    };


    return `

        <span class="status ${
            classMap[status] || "open"
        }">

            ${escapeHtml(
                status || "-"
            )}

        </span>

    `;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   DARK MODE
========================================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    localStorage.setItem(
        "itHelpProTheme",

        document.body.classList.contains(
            "dark"
        )
            ? "dark"
            : "light"
    );

}


/* =========================================================
   LOAD SAVED THEME
========================================================= */

if (
    localStorage.getItem(
        "itHelpProTheme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "modalOverlay"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openPage = openPage;

window.quickTicket = quickTicket;

window.resetForm = resetForm;

window.closeModal = closeModal;

window.clearTickets = clearTickets;

window.searchTicket = searchTicket;

window.filterKnowledge = filterKnowledge;

window.showTrouble = showTrouble;

window.updateTicketStatus =
    updateTicketStatus;

window.deleteTicket =
    deleteTicket;