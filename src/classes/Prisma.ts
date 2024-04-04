import { PrismaClient } from "@prisma/client";

class Prisma {

    private static _instance: Prisma;

    private constructor() { }

    static getInstance() {
        if (!Prisma._instance) {
            Prisma._instance = new Prisma();
        }

        return Prisma._instance;
    }

    create() {
        return new PrismaClient();
    }

}

export default Prisma;