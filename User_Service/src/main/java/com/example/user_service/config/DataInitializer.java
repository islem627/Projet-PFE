/*package com.example.commande_service.config;


import com.example.commande_service.entities.GovernorateEntity;
import com.example.commande_service.repositories.GovernorateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GovernorateRepo governorateRepo;

    @Override
    public void run(String... args) throws Exception {
        governorateRepo.deleteAll();

        GovernorateEntity tunis = new GovernorateEntity();
        tunis.setName("Tunis");
        governorateRepo.save(tunis);

        GovernorateEntity sfax = new GovernorateEntity();
        sfax.setName("Sfax");
        governorateRepo.save(sfax);

        GovernorateEntity sousse = new GovernorateEntity();
        sousse.setName("Sousse");
        governorateRepo.save(sousse);

        GovernorateEntity ariana = new GovernorateEntity();
        ariana.setName("Ariana");
        governorateRepo.save(ariana);

        GovernorateEntity bizerte = new GovernorateEntity();
        bizerte.setName("Bizerte");
        governorateRepo.save(bizerte);
    }
}
*/

package com.example.user_service.config;

import com.example.user_service.entities.GovernorateEntity;
import com.example.user_service.repositories.GovernorateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GovernorateRepo governorateRepo;

    @Override
    public void run(String... args) throws Exception {
        governorateRepo.deleteAll();

        String[] governorates = {
                "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
                "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
                "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
                "Gabès", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
        };

        for (String name : governorates) {
            GovernorateEntity gov = new GovernorateEntity();
            gov.setName(name);
            governorateRepo.save(gov);
        }
    }
}
