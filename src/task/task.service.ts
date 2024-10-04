import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RentalService } from '../rental/rental.service';
import * as moment from 'moment-timezone';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly rentalService: RentalService) {}

  // Tâche planifiée pour envoyer des emails à J-5 avant la date de retour
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  handleReminderJ5() {
    this.logger.log('Envoi des emails pour les rappels à J-5...');
    this.sendReminderEmails(5);
  }

  // Tâche planifiée pour envoyer des emails à J-3 avant la date de retour
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  handleReminderJ3() {
    this.logger.log('Envoi des emails pour les rappels à J-3...');
    this.sendReminderEmails(3);
  }

  // Fonction pour envoyer des emails en fonction du nombre de jours avant la date de retour
  async sendReminderEmails(daysBeforeReturn: number) {
    const rentals = await this.rentalService.findAll();

    const today = moment();

    rentals.forEach((rental) => {
      const returnDate = moment(rental.return_date);
      const diff = returnDate.diff(today, 'days');

      if (diff === daysBeforeReturn) {
        this.logger.log(
          `Envoi d'un email à ${rental.customer.email} pour un rappel à J-${daysBeforeReturn}`
        );
      }
    });
  }
}
