const ulList = document.body.querySelector('#list1');
itemList;
Array.forEach((item) => {
  const itemList = document.createElement('li');
  itemList.innerHTML = item;
  ulList.append(itemList);

})