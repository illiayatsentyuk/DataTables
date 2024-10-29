const DataTable = async (config) => {
  const tableId = generateTableId();
  const users = await fetchData(config.apiUrl);
  console.log(users);
  const dataTable = document.querySelector(config.parent);
  const table = document.createElement("table");
  table.classList.add("my-table");
  table.setAttribute("table-id", tableId);
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  let string = ``;
  config.columns.forEach((e) => {
    string += `<th>${e.title}</th>`;
  });
  thead.innerHTML = `<th>№</th>${string}`;
  table.appendChild(thead);
  string = ``;
  for (let i = 0; i < users.length; i++) {
    string += `<tr><td>${i}</td>`;
    config.columns.forEach((e) => {
      if (typeof e.value === "function") {
        string += `<td>${e.value(users[i])}</td>`;
      } else if (users[i][e.value] != undefined) {
        string += `<td>${users[i][e.value]}</td>`;
      }
    });
    string += `<td><button class="table-button--delete" data-id=${i}-${tableId}>Видалити</button></td>`;
    string += `</tr>`;
  }
  tbody.innerHTML += string;
  table.appendChild(tbody);
  dataTable.appendChild(table);
  // const buttons = document.querySelectorAll(".table-button--delete");
  dataTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("table-button--delete")) {
      const button = event.target;
      console.log(deleteItem(button.getAttribute("data-id"), config));
    }
  });
};

const generateTableId = () => {
  const tables = document.querySelectorAll(".my-table");
  const tablesIds = Array.from(tables)
    .map((table) => table.getAttribute("table-id"))
    .filter((id) => id !== null);
  let tableId;

  do {
    tableId = Math.floor(1000 + Math.random() * 9000);
  } while (tablesIds.includes(tableId));

  return tableId;
};

const deleteItem = (id) => {
  console.log(id)
};

const fetchData = async (url) => {
  const fetchedData = await fetch(url);
  const data1 = await fetchedData.json();
  let mas = [];
  let daTa = data1.data;
  Object.keys(daTa).forEach((key) => {
    mas.push(daTa[key]);
  });
  return mas;
};

const getAge = (birthday) => {
  let data = new Date(birthday.split("T")[0]);
  let data1 = new Date(new Date().toISOString().split("T")[0]);
  let yearDifference = data1.getFullYear() - data.getFullYear();
  if (
    data1.getMonth() < data.getMonth() ||
    (data1.getMonth() === data.getMonth() && data1.getDate() < data.getDate())
  ) {
    yearDifference--;
  }

  return yearDifference;
};

const getColorLabel = (product) => {
  return product;
};

const config1 = {
  parent: "#usersTable",
  columns: [
    { title: "Ім’я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: (user) => getAge(user.birthday) }, // функцію getAge вам потрібно створити
    {
      title: "Фото",
      value: (user) =>
        `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
    },
  ],
  apiUrl: "https://mock-api.shpp.me/illia/users",
};

const config2 = {
  parent: "#productsTable",
  columns: [
    { title: "Назва", value: "title" },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
    },
    { title: "Колір", value: (product) => getColorLabel(product.color) }, // функцію getColorLabel вам потрібно створити
  ],
  apiUrl: "https://mock-api.shpp.me/illia/products",
};

DataTable(config2);
DataTable(config1);
