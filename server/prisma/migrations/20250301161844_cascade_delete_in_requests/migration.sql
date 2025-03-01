-- DropForeignKey
ALTER TABLE "ExchangeRequest" DROP CONSTRAINT "ExchangeRequest_receiverBookId_fkey";

-- DropForeignKey
ALTER TABLE "ExchangeRequest" DROP CONSTRAINT "ExchangeRequest_senderBookId_fkey";

-- AddForeignKey
ALTER TABLE "ExchangeRequest" ADD CONSTRAINT "ExchangeRequest_senderBookId_fkey" FOREIGN KEY ("senderBookId") REFERENCES "BookForExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRequest" ADD CONSTRAINT "ExchangeRequest_receiverBookId_fkey" FOREIGN KEY ("receiverBookId") REFERENCES "BookForExchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
