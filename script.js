const fromDetail = document.querySelector("#from-details");
const toDetail = document.querySelector("#to-details");
const itemRowsContainer = document.getElementById("item-rows");
const addBtn = document.querySelector(".add-item-btn");
const printBtn = document.getElementById("print-btn");
const clearBtn = document.getElementById("clear-btn");
const billModal = document.getElementById("bill-modal");
const billContent = document.getElementById("bill-content");
const closeModalBtn = document.getElementById("close-modal-btn");

function createRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="item-desc" placeholder="Description..."></td>
    <td><input type="number" class="item-qty" value="1" min="1"></td>
    <td><input type="number" class="item-rate" value="0" min="0" step="0.01"></td>
    <td>$<span class="item-amount">0.00</span></td>
    <td><button class="delete-btn">X</button></td>
  `;

  const qtyInput = row.querySelector(".item-qty");
  const rateInput = row.querySelector(".item-rate");
  const amountSpan = row.querySelector(".item-amount");
  const deleteBtn = row.querySelector(".delete-btn");

  function updateRowTotal() {
    const qty = parseFloat(qtyInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    amountSpan.textContent = (qty * rate).toFixed(2);
    calculateGrandTotal();
  }

  qtyInput.addEventListener("input", updateRowTotal);
  rateInput.addEventListener("input", updateRowTotal);

  deleteBtn.addEventListener("click", () => {
    if (itemRowsContainer.children.length > 1) {
      row.remove();
      calculateGrandTotal();
    } else {
      alert("You must keep at least one item on the invoice!");
    }
  });

  return row;
}

function calculateGrandTotal() {
  let total = 0;
  document.querySelectorAll(".item-amount").forEach((span) => {
    total += parseFloat(span.textContent) || 0;
  });
  document.getElementById("grand-total").textContent = total.toFixed(2);
}

function showBillPreview() {
  const from = fromDetail.value.trim() || "—";
  const to = toDetail.value.trim() || "—";
  let rowsHTML = "";
  document.querySelectorAll("#item-rows tr").forEach((tr) => {
    const desc = tr.querySelector(".item-desc").value.trim() || "—";
    const qty = tr.querySelector(".item-qty").value;
    const rate = parseFloat(tr.querySelector(".item-rate").value || 0).toFixed(
      2,
    );
    const amount = tr.querySelector(".item-amount").textContent;
    rowsHTML += `
      <tr>
        <td>${desc}</td>
        <td>${qty}</td>
        <td>$${rate}</td>
        <td>$${amount}</td>
      </tr>
    `;
  });

  const grandTotal = document.getElementById("grand-total").textContent;

  billContent.innerHTML = `
    <h2>INVOICE</h2>
    <div class="bill-header">
      <div><strong>From</strong>${from.replace(/\n/g, "<br>")}</div>
      <div><strong>Bill To</strong>${to.replace(/\n/g, "<br>")}</div>
    </div>
    <table class="bill-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>${rowsHTML}</tbody>
    </table>
    <div class="bill-total">Total: $${grandTotal}</div>
  `;

  billModal.classList.remove("hidden");
}

if (printBtn) {
  printBtn.addEventListener("click", showBillPreview);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    billModal.classList.add("hidden");
  });
}

if (addBtn) {
  addBtn.addEventListener("click", () => {
    itemRowsContainer.appendChild(createRow());
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (fromDetail) fromDetail.value = "";
    if (toDetail) toDetail.value = "";
    itemRowsContainer.innerHTML = "";
    itemRowsContainer.appendChild(createRow());
    document.getElementById("grand-total").textContent = "0.00";
  });
}

if (itemRowsContainer.children.length === 0) {
  itemRowsContainer.appendChild(createRow());
}
