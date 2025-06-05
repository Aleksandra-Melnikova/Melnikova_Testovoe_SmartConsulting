# Тестовое задание Мельникова 

## UML-диаграмма модели User

```mermaid
classDiagram
    class User {
        +String username
        +String password
        +String token
        +String lastName
        +String firstName
        +String middleName
        +Date birthDate
        +String phone
        +Passport passport
        +WorkInfo workInfo
    }
       class Passport {
        +String series
        +String number
        +String issuedBy
        +Date issueDate
    }

    class WorkInfo {
        +String companyName
        +String workPhone
        +String address
    }
    User "1" --> "1" Passport
    User "1" --> "1" WorkInfo
```

### Npm-скрипты
#### Установка зависимостей
- `npm install` — установка всех зависимостей проекта

#### Разработка
- `npm run dev` — запуск приложения в режиме разработки (Vite)

#### Анализ кода
- `npm run format` — автоформатирование кода с помощью Prettier
---

#### В качестве хранилища использована реальная база MongoDB

#### Обязательные поля при регистрации пользователя:
- 'username',
- 'password',
- 'lastName',
- 'firstName',
- 'birthDate',
- 'phone',
- 'passport.series',
- 'passport.number',
- 'passport.issuedBy',
- 'passport.issueDate'