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