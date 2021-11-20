# Requirements

## POST /users
- create new user (username, password, about)

```
{
  username,
  password,
  about,
}
```

returns >>

```
{
  id,
  username,
}
```

OR error

## POST /login

- logs in user (username, password)

```
{
  username,
  password,
}
```

returns >>

```
{
  token
}
```

OR error