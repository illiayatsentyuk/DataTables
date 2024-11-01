const DataTable = async (config) => {
  const tableId = generateTableId();
  const dataFromFetch = await fetchData(config.apiUrl)
  const users = dataFromFetch.mas;
  const indexes = dataFromFetch.masOfIndex;
  const dataTable = document.querySelector(config.parent);
  const body = document.querySelector("body")
  const addButton = document.createElement("button");
  const table = document.createElement("table");
  table.classList.add("my-table");
  table.setAttribute("table-id", tableId);
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  tbody.setAttribute("table-tbody-id",`${tableId}-tbody`)
  let string = ``;
  if(config.parent=="#productsTable"){
    console.log(222)
    addButton.setAttribute("id","addButton")
    addButton.innerHTML = "<h3>Додати</h3>"
    console.log(dataTable)
    dataTable.appendChild(addButton);
    console.log(dataTable)
  }
  config.columns.forEach((e) => {
    string += `<th>${e.title}</th>`;
  });
  thead.innerHTML = `<th>№</th>${string}`;
  table.appendChild(thead);
  string = ``;
  for (let i = 0; i < users.length; i++) {
    string += `<tr id=${tableId}-${indexes[i]}><td>${indexes[i]}</td>`;
    config.columns.forEach((e) => {
      if (typeof e.value === "function") {
        string += `<td>${e.value(users[i])}</td>`;
      } else if (users[i][e.value] != undefined) {
        string += `<td>${users[i][e.value]}</td>`;
      }
    });
    string += `<td><button class="table-button--delete" data-id=${indexes[i]}-${tableId}>Видалити</button></td>`;
    if(config.parent==="#productsTable"){
      string += `<td><button class="table-button--edit" id=${indexes[i]}-${tableId}>Редагувати</button></td>`
    }
    string += `</tr>`;
  }
  tbody.innerHTML += string;
  table.appendChild(tbody);
  dataTable.appendChild(table);
  const tbodyId = `${tableId}-tbody`
  addButton.addEventListener("click",()=>{
    createModalWindow(0,config,tableId,indexes)
  })
  // const buttons = document.querySelectorAll(".table-button--delete");
  dataTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("table-button--delete")) {
      // console.log(config)
      const button = event.target;
      deleteItem(button.getAttribute("data-id").split("-")[0],tbodyId, config);
    }
    if (event.target.classList.contains("table-button--edit")) {
      // console.log(config)
      const button = event.target;
      createModalWindow(button.getAttribute("id").split("-")[0],config,tableId,indexes)
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
const createModalWindow = (id,config,tableId,indexes) => {
  const tbody = document.querySelector(`tbody[table-tbody-id="${tableId}-tbody"]`);
  console.log(id)
  const modalWindow = document.createElement("div")
  const body = document.querySelector("body")
  body.appendChild(modalWindow);
  modalWindow.innerHTML = ""
  const addButton = document.querySelector("#addButton");
  modalWindow.setAttribute("id","add-product")
  modalWindow.classList.add("popup")
  console.log(config.columns[1].input[1].options)
  let content = `
  <div class="popup-content">
    <div class="popup-body">
      <span class="close">&times;</span>
      <input id="titleInput" type="${config.columns[0].input.type}" placeholder="${config.columns[0].title}">
      <input id="priceInput" type="${config.columns[1].input[0].type}" name="${config.columns[1].input[0].name}" label="${config.columns[1].input[0].label}" placeholder="${config.columns[1].title}">
      <select id="currencyInput" name="${config.columns[1].input[1].name}" label="${config.columns[1].input[1].label}" required="${config.columns[1].input[1].required}">
        <option> </option>
        <option>${config.columns[1].input[1].options[0]}</option>
        <option>${config.columns[1].input[1].options[1]}</option>
        <option>${config.columns[1].input[1].options[2]}</option>
      </select>
      <input id="colorInput" type="${config.columns[2].input.type}" name="color">
      <button id="addProductButton">Submit</button>
    </div>
  </div>
  `
  modalWindow.innerHTML+=content
  const closeButton = modalWindow.querySelector(".close")
  const addProductButton = document.querySelector("#addProductButton");
  addProductButton.addEventListener("click",()=>{
    const titleInput = document.querySelector("#titleInput")
    const priceInput = document.querySelector("#priceInput")
    const currencyInput = document.querySelector("#currencyInput");
    const colorInput = document.querySelector("#colorInput");
    titleInput.getAttribute("required")
    if(titleInput.value.trim()==""){
      titleInput.style.border = "1px solid red"
    }
    if(priceInput.value.trim()==""){
      priceInput.style.border = "1px solid red"
    }
    if(titleInput.value.trim()!=="" && priceInput.value.trim()!==""){
      const product = {
        title:titleInput.value,
        price: +priceInput.value,
        color:colorInput.value,
        currency:currencyInput.value,
      }
      fetch(config.apiUrl,{
        method:"post",
        body:JSON.stringify(product)
      }).then(response => {
        return response.json();
     }).then(response => {
        const tr = document.createElement("tr")
        const idOfTr = indexes.length+1
        tr.setAttribute('id',`${tableId}-${idOfTr}`)
        let string1 = `
          <td>${idOfTr}</td>
          <td>${titleInput.value}</td>
          <td>${priceInput.value} ${currencyInput.value}</td>
          <td>${colorInput.value}</td>
          <td><button class="table-button--delete" data-id=${idOfTr}-${tableId}>Видалити</button></td>
        `
        tr.innerHTML = string1
        let text = idOfTr.toString()
        indexes.push(text)
        tbody.appendChild(tr);
      }).catch(err => { 
        console.log(err);
      });
      modalWindow.style.display="none";
    }
  })
  closeButton.addEventListener("click",()=>{
    modalWindow.style.display = "none";
  })

  addButton.addEventListener("click",()=>{
    console.log(1111)
    modalWindow.style.display = "block";
  })
}
const deleteItem = (id,tbodyId,config,indexes) => {
  fetch(`${config.apiUrl}/${id}`,{
    method:"delete"
  }).then((response) => {
    return response.json();
  })
  .then((data) => {
    const tr = document.querySelector(`[id="${tbodyId.split("-")[0]}-${id}"]`).remove();
    const index = indexes.indexOf(id.toString())
    if (index > -1) { // only splice array when item is found
      indexes.splice(index, 1); // 2nd parameter means remove one item only
    }
  })
  .catch((err)=>{
    console.log(err)
  });
};

const fetchData = async (url) => {
  const fetchedData = await fetch(url);
  const data1 = await fetchedData.json();
  let mas = [];
  let masOfIndex = []
  let daTa = data1.data;
  Object.keys(daTa).forEach((key) => {
    masOfIndex.push(key);
    mas.push(daTa[key]);
  });
  return {mas,masOfIndex};
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
  apiUrl: "https://mock-api.shpp.me/abcd/users",
};

const config2 = {
  parent: '#productsTable',
  columns: [
    {
      title: 'Назва', 
      value: 'title', 
      input: { type: 'text' }
    },
    {
      title: 'Ціна', 
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        { type: 'number', name: 'price', label: 'Ціна' },
        { type: 'select', name: 'currency', label: 'Валюта', options: ['$', '€', '₴'], required: false }
      ]
    },
    {
      title: 'Колір', 
      value: (product) => getColorLabel(product.color), // функцію getColorLabel вам потрібно створити
      input: { type: 'color', name: 'color' }
    }, 
  ],
  apiUrl: "https://mock-api.shpp.me/abcd/products"
};
DataTable(config1)
DataTable(config2)