import { NORMS } from "./bloodNorms";
import type { BloodType } from "../../../backend/src/shared/types";

export const getSimpleRecommendation = (r: BloodType): string[] => {
  const messages: string[] = [];

  if (r.hemoglobin !== undefined) {
    if (r.hemoglobin < NORMS.hemoglobin.min) {
      messages.push(
        "Niski poziom hemoglobiny — może wskazywać na niedobór żelaza. Warto rozważyć dietę bogatą w żelazo i konsultację z lekarzem."
      );
    } else if (r.hemoglobin > NORMS.hemoglobin.max) {
      messages.push(
        "Podwyższona hemoglobina — możliwy wpływ odwodnienia lub stylu życia. Zadbaj o nawodnienie i obserwuj kolejne wyniki."
      );
    } else {
      messages.push("Poziom hemoglobiny mieści się w normie.");
    }
  }

  if (r.wbc !== undefined) {
    if (r.wbc < NORMS.wbc.min) {
      messages.push(
        "Obniżona liczba leukocytów (WBC) — może świadczyć o osłabieniu odporności. Warto skonsultować wynik, jeśli się powtarza."
      );
    } else if (r.wbc > NORMS.wbc.max) {
      messages.push(
        "Podwyższone WBC — może być związane ze stanem zapalnym lub infekcją. Obserwuj objawy i rozważ konsultację."
      );
    } else {
      messages.push("Liczba leukocytów (WBC) jest prawidłowa.");
    }
  }

  if (r.platelets !== undefined) {
    if (r.platelets < NORMS.platelets.min) {
      messages.push(
        "Niski poziom płytek krwi — może zwiększać ryzyko krwawień. Jeśli wynik się powtarza, skonsultuj go z lekarzem."
      );
    } else if (r.platelets > NORMS.platelets.max) {
      messages.push(
        "Podwyższona liczba płytek krwi — może być reakcją organizmu na stan zapalny. Warto monitorować kolejne wyniki."
      );
    } else {
      messages.push("Poziom płytek krwi mieści się w normie.");
    }
  }

  if (r.glucose !== undefined) {
    if (r.glucose < NORMS.glucose.min) {
      messages.push(
        "Obniżona glukoza — może powodować osłabienie lub zawroty głowy. Zadbaj o regularne posiłki."
      );
    } else if (r.glucose > NORMS.glucose.max) {
      messages.push(
        "Podwyższona glukoza — może wskazywać na zaburzenia gospodarki cukrowej. Ogranicz cukry proste i rozważ dalszą diagnostykę."
      );
    } else {
      messages.push("Poziom glukozy jest prawidłowy.");
    }
  }

  if (r.cholesterolTotal !== undefined) {
    if (r.cholesterolTotal > NORMS.cholesterolTotal.max) {
      messages.push(
        "Podwyższony cholesterol całkowity — warto zwrócić uwagę na dietę, aktywność fizyczną i kontrolować kolejne wyniki."
      );
    } else {
      messages.push("Poziom cholesterolu całkowitego mieści się w normie.");
    }
  }

  return messages;
};
