# Tournament organizer

### Commands
```sh

## Containers
docker-compose up --build

docker-compose down

docker-compose up -d 

## DB
npx prisma db pull

npx prisma db push

npx prisma migrate resolve --applied 20230920150705_init

npx prisma migrate dev --name <name>

npx prisma studio 

# limpiar cache de next
 rm -rf .next
```