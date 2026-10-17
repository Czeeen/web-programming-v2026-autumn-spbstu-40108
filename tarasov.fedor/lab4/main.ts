import {Travel} from './model.js';

let travels: Travel[] = [];
let errorTimeoutId: number | undefined;

function executeAsync<T>(operation: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, 50);
  });
}

function showError(error: unknown): void {
  const message =
    error instanceof Error ? error.message : 'Произошла неизвестная ошибка';

  let errorBanner = document.querySelector<HTMLElement>(
    '[data-testid="error-message"]',
  );

  if (!errorBanner) {
    errorBanner = document.createElement('div');
    errorBanner.setAttribute('data-testid', 'error-message');
    errorBanner.setAttribute('role', 'alert');
    errorBanner.className = 'error-banner';

    const main = document.querySelector('main');
    const listContainer = document.querySelector('[data-testid="entity-list"]');
    if (main && listContainer) {
      main.insertBefore(errorBanner, listContainer);
    } else {
      document.body.prepend(errorBanner);
    }
  }

  errorBanner.textContent = `Ошибка: ${message}`;
  errorBanner.style.display = 'block';

  if (errorTimeoutId !== undefined) {
    clearTimeout(errorTimeoutId);
  }
  errorTimeoutId = window.setTimeout(() => {
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
  }, 4000);
}

function clearError(): void {
  const errorBanner = document.querySelector<HTMLElement>(
    '[data-testid="error-message"]',
  );
  if (errorBanner) {
    errorBanner.style.display = 'none';
    errorBanner.textContent = '';
  }
}

function saveState(): void {
  try {
    localStorage.setItem('travels', JSON.stringify(travels));
  } catch {
    throw new Error('Не удалось сохранить данные в localStorage');
  }
}

function loadState(): void {
  const saved = localStorage.getItem('travels');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      travels = parsed.map(
        (item: {
          id: number | string;
          travelerName: string;
          visitedCountries: string[];
        }) =>
          new Travel(Number(item.id), item.travelerName, item.visitedCountries),
      );
    } catch {
      travels = [];
      showError(new Error('Не удалось загрузить сохраненные данные'));
    }
  }
}

function render(): void {
  const listContainer = document.querySelector('[data-testid="entity-list"]');
  if (!listContainer) {
    return;
  }
  listContainer.innerHTML = '';

  travels.forEach((travel) => {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'travel-card';

    const title = document.createElement('h3');
    title.textContent = `${travel.travelerName} (ID: ${travel.id})`;

    const countInfo = document.createElement('p');
    countInfo.className = 'visited-count';
    countInfo.textContent = `Посещено стран: ${travel.visitedCount}`;

    const countriesList = document.createElement('ul');
    travel.visitedCountries.forEach((country) => {
      const li = document.createElement('li');
      li.textContent = `${country} `;

      const removeCountryBtn = document.createElement('button');
      removeCountryBtn.textContent = 'Удалить страну';
      removeCountryBtn.className = 'btn-small btn-remove-country';
      removeCountryBtn.addEventListener('click', () => {
        executeAsync(() => {
          if (!travel.visitedCountries.includes(country)) {
            throw new Error(`Страна "${country}" не найдена в списке`);
          }
          travel.removeCountry(country);
          saveState();
        })
          .then(() => {
            clearError();
            render();
          })
          .catch((err) => showError(err));
      });

      li.appendChild(removeCountryBtn);
      countriesList.appendChild(li);
    });

    const addCountryForm = document.createElement('form');
    addCountryForm.className = 'add-country-form';
    addCountryForm.innerHTML = `
      <input type="text" name="newCountry" placeholder="Название страны" required />
      <button type="submit" class="btn-small">Добавить страну</button>
    `;
    addCountryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addCountryForm);
      const newCountry = (formData.get('newCountry') as string).trim();

      executeAsync(() => {
        if (!newCountry) {
          throw new Error('Название страны не может быть пустым');
        }
        if (travel.visitedCountries.includes(newCountry)) {
          throw new Error(
            `Страна "${newCountry}" уже добавлена в это путешествие`,
          );
        }
        travel.addCountry(newCountry);
        saveState();
      })
        .then(() => {
          clearError();
          render();
        })
        .catch((err) => showError(err));
    });

    const deleteTravelBtn = document.createElement('button');
    deleteTravelBtn.setAttribute('data-testid', 'delete-entity');
    deleteTravelBtn.textContent = 'Удалить путешествие';
    deleteTravelBtn.className = 'btn-delete-entity';
    deleteTravelBtn.addEventListener('click', () => {
      executeAsync(() => {
        if (!travels.some((t) => t.id === travel.id)) {
          throw new Error(`Путешествие с ID ${travel.id} не найдено`);
        }
        travels = travels.filter((t) => t.id !== travel.id);
        saveState();
      })
        .then(() => {
          clearError();
          render();
        })
        .catch((err) => showError(err));
    });

    card.appendChild(title);
    card.appendChild(countInfo);
    card.appendChild(countriesList);
    card.appendChild(addCountryForm);
    card.appendChild(deleteTravelBtn);

    listContainer.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();

  const form = document.querySelector(
    'form[data-testid="entity-form"]',
  ) as HTMLFormElement;
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      const id = parseInt(formData.get('id') as string, 10);
      const travelerName = (formData.get('travelerName') as string).trim();

      executeAsync(() => {
        if (isNaN(id) || id <= 0) {
          throw new Error('ID путешествия должен быть положительным числом');
        }
        if (!travelerName) {
          throw new Error('Имя путешественника не может быть пустым');
        }
        if (travels.some((t) => t.id === id)) {
          throw new Error(`Путешествие с ID ${id} уже существует`);
        }

        travels.push(new Travel(id, travelerName));
        saveState();
      })
        .then(() => {
          clearError();
          form.reset();
          render();
        })
        .catch((err) => showError(err));
    });
  }
});
