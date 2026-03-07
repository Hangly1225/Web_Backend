// Функция для получения данных с API
async function fetchUsers() {
    try {
        const randomFilter = Math.random() > 0.5 ? 'greater' : 'less'; 
        const limit = randomFilter === 'greater' ? 100 : 200;
        const url = 'https://jsonplaceholder.typicode.com/users';
        
        // Отображаем preloader
        document.getElementById('preloader').style.display = 'block';
        document.getElementById('error-message').textContent = '';
    
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
    
        const users = await response.json();
        const filteredUsers = users.filter(user => {
            return randomFilter === 'greater' ? user.id > limit : user.id < limit;
        });
    
        renderUsers(filteredUsers);
    
        } catch (error) {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('error-message').textContent = '⚠ Что-то пошло не так';
        }
    }
  
  // Функция для отображения пользователей на странице
  function renderUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  
  
    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.classList.add('user-item');
      listItem.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Adress:</strong> ${user.address.city}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
      `;
      userList.appendChild(listItem);
    });
  
    document.getElementById('preloader').style.display = 'none';
  }
  
  window.addEventListener('load', fetchUsers);
  