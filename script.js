const sections = [
    {
        name: "VIP",
        id: "vip-seats",
        rows: 4,
        seatsPerRow: 10,
        price: 150,
        unavailableSeats: [
            { row: 1, seat: 3 },
            { row: 2, seat: 7 }
        ]
    },
    {
        name: "Premium",
        id: "premium-seats",
        rows: 6,
        seatsPerRow: 12,
        price: 100,
        unavailableSeats: [
            { row: 2, seat: 5 },
            { row: 4, seat: 9 }
        ]
    },
    {
        name: "General",
        id: "general-seats",
        rows: 10,
        seatsPerRow: 14,
        price: 40,
        unavailableSeats: [
            { row: 3, seat: 6 },
            { row: 7, seat: 10 }
        ]
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

            seatButton.dataset.unavailable = section.unavailableSeats.some(function(ticket) {
                return ticket.row === row && ticket.seat === seat;
            });

            seatButton.classList.toggle(
                "unavailable",
                seatButton.dataset.unavailable === "true"
            );

            rowElement.appendChild(seatButton);
        }

        container.appendChild(rowElement);
    }
});

let selectedSeat = null;

const cart = [];
const addToCartButton = document.getElementById("add-to-cart");
const cartMessage = document.getElementById("cart-message");

function isSeatInCart(seatButton) {
    return cart.some(function(ticket) {
        return ticket.section === seatButton.dataset.section &&
            ticket.row === seatButton.dataset.row &&
            ticket.seat === seatButton.dataset.seat;
    });
}

function updateCartButton() {
    const unavailable = selectedSeat.dataset.unavailable === "true";
    const alreadyInCart = isSeatInCart(selectedSeat);

    addToCartButton.disabled = unavailable || alreadyInCart;

    if (unavailable) {
        addToCartButton.textContent = "Unavailable";
        cartMessage.textContent = "This seat is unavailable and cannot be added.";
    } else if (alreadyInCart) {
        addToCartButton.textContent = "Already in Cart";
        cartMessage.textContent = "This seat is already in your cart.";
    } else {
        addToCartButton.textContent = "Add to Cart";
        cartMessage.textContent = "";
    }
}

function saveState() {
    const inspectedSeat = selectedSeat === null ? null : {
        section: selectedSeat.dataset.section,
        row: selectedSeat.dataset.row,
        seat: selectedSeat.dataset.seat
    };

    try {
        localStorage.setItem("chess-ticketing-state", JSON.stringify({
            cart: cart,
            inspectedSeat: inspectedSeat
        }));

        document.getElementById("storage-message").textContent = "";
    } catch {
        document.getElementById("storage-message").textContent =
            "Your changes could not be saved. They may be lost after refreshing.";
    }
}

function updateSeatStates() {
    document.querySelectorAll(".seat").forEach(function(seatButton) {
        const inCart = isSeatInCart(seatButton);

        seatButton.classList.toggle("in-cart", inCart);
        seatButton.setAttribute(
            "aria-label",
            `${seatButton.dataset.section}, row ${seatButton.dataset.row}, seat ${seatButton.dataset.seat}, ${seatButton.dataset.price} AZN${seatButton.dataset.unavailable === "true" ? ", unavailable" : isSeatInCart(seatButton) ? ", in cart" : ", available"}`
        );
    });
}

function findSeat(ticket) {
    if (!ticket || typeof ticket !== "object") {
        return null;
    }

    return Array.from(document.querySelectorAll(".seat")).find(function(seatButton) {
        return seatButton.dataset.section === ticket.section &&
            seatButton.dataset.row === ticket.row &&
            seatButton.dataset.seat === ticket.seat;
    });
}

function restoreState() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("chess-ticketing-state")
        );

        if (!saved || !Array.isArray(saved.cart)) {
            return;
        }

        saved.cart.forEach(function(ticket) {
            const seatButton = findSeat(ticket);

            if (
                seatButton &&
                seatButton.dataset.unavailable !== "true" &&
                !isSeatInCart(seatButton)
            ) {
                cart.push({
                    section: seatButton.dataset.section,
                    row: seatButton.dataset.row,
                    seat: seatButton.dataset.seat,
                    price: Number(seatButton.dataset.price)
                });
            }
        });

        renderCart();
        updateSeatStates();

        const inspectedSeat = findSeat(saved.inspectedSeat);

        if (inspectedSeat) {
            inspectedSeat.click();
        }
    } catch {
        document.getElementById("storage-message").textContent =
            "Saved tickets could not be loaded. Your current cart is still usable.";
    }
}

document.querySelectorAll(".seat").forEach(function(seatButton) {
    seatButton.setAttribute("aria-pressed", "false");
    seatButton.setAttribute(
        "aria-label",
        `${seatButton.dataset.section}, row ${seatButton.dataset.row}, seat ${seatButton.dataset.seat}, ${seatButton.dataset.price} AZN${seatButton.dataset.unavailable === "true" ? ", unavailable" : isSeatInCart(seatButton) ? ", in cart" : ", available"}`
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
        updateCartButton();
        saveState();
    });
});

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    let total = 0;

    cartItems.replaceChildren();

    cart.forEach(function(ticket, index) {
        const item = document.createElement("li");
        const description = document.createElement("span");
        const removeButton = document.createElement("button");

        description.textContent =
            `${ticket.section} — Row ${ticket.row}, Seat ${ticket.seat} — ${ticket.price} AZN`;

        removeButton.type = "button";
        removeButton.className = "remove-ticket";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${ticket.section}, row ${ticket.row}, seat ${ticket.seat}`
        );

        removeButton.addEventListener("click", function() {
            cart.splice(index, 1);
            renderCart();
            updateSeatStates();

            if (selectedSeat !== null) {
                updateCartButton();
            }

            saveState();

            const remainingButtons = cartItems.querySelectorAll(".remove-ticket");
            const nextButton = remainingButtons[index] || remainingButtons[index - 1];

            if (nextButton) {
                nextButton.focus();
            } else {
                document.getElementById("cart-heading").focus();
            }
        });

        item.appendChild(description);
        item.appendChild(removeButton);
        cartItems.appendChild(item);
        total += ticket.price;
    });

    document.getElementById("cart-empty").hidden = cart.length > 0;
    document.getElementById("cart-total").textContent = total;
}

addToCartButton.addEventListener("click", function() {
    if (selectedSeat === null) {
        return;
    }

    if (selectedSeat.dataset.unavailable === "true") {
        updateCartButton();
        return;
    }

    if (isSeatInCart(selectedSeat)) {
        updateCartButton();
        return;
    }

    const ticket = {
        section: selectedSeat.dataset.section,
        row: selectedSeat.dataset.row,
        seat: selectedSeat.dataset.seat,
        price: Number(selectedSeat.dataset.price)
    };

    cart.push(ticket);
    renderCart();
    updateCartButton();
    updateSeatStates();
    saveState();

    cartMessage.textContent =
        `${ticket.section}, row ${ticket.row}, seat ${ticket.seat} added to cart.`;
});

restoreState();
