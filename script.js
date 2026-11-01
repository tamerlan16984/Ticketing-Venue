const sections = [
    {
        name: "VIP",
        id: "vip-seats",
        rows: 4,
        seatsPerRow: 10,
        price: 150
    },
    {
        name: "Premium",
        id: "premium-seats",
        rows: 6,
        seatsPerRow: 12,
        price: 100
    },
    {
        name: "General",
        id: "general-seats",
        rows: 10,
        seatsPerRow: 14,
        price: 40
    }
];
sections.forEach(function(section) {
    const container = document.getElementById(section.id);

    for (let row = 1; row <= section.rows; row++) {
        const rowElement = document.createElement("div");
        rowElement.className = "seat-row";

        for (let seat = 1; seat <= section.seatsPerRow; seat++) {
            const seatButton = document.createElement("button");

            seatButton.className = "seat";
            seatButton.textContent = seat;
            seatButton.type = "button";

            seatButton.dataset.section = section.name;
            seatButton.dataset.row = row;
            seatButton.dataset.seat = seat;
            seatButton.dataset.price = section.price;

            rowElement.appendChild(seatButton);
        }

        container.appendChild(rowElement);
    }
});

let selectedSeat = null;

document.querySelectorAll(".seat").forEach(function(seatButton) {
    seatButton.setAttribute("aria-pressed", "false");
    seatButton.setAttribute(
        "aria-label",
        `${seatButton.dataset.section}, row ${seatButton.dataset.row}, seat ${seatButton.dataset.seat}, ${seatButton.dataset.price} AZN`
    );

    seatButton.addEventListener("click", function() {
        if (selectedSeat !== null) {
            selectedSeat.classList.remove("selected");
            selectedSeat.setAttribute("aria-pressed", "false");
        }

        selectedSeat = seatButton;
        selectedSeat.classList.add("selected");
        selectedSeat.setAttribute("aria-pressed", "true");

        document.getElementById("seat-message").hidden = true;
        document.getElementById("selected-seat-info").hidden = false;

        document.getElementById("selected-section").textContent = seatButton.dataset.section;
        document.getElementById("selected-row").textContent = seatButton.dataset.row;
        document.getElementById("selected-number").textContent = seatButton.dataset.seat;
        document.getElementById("selected-price").textContent = seatButton.dataset.price;
    });
});
