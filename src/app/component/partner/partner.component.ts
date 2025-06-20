/*import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {
  orderForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      dateCommande: ['', [Validators.required]],  // Date de la commande
      adresse_livraison: ['', [Validators.required]],  // Adresse de livraison
      total: ['', [Validators.required, Validators.min(0)]],  // Total de la commande
      articel_commande: ['', [Validators.required]],  // Article commandé
      date_livraison_estimee: ['', [Validators.required]],
      ispaied: [false, [Validators.required]],  // Statut de paiement
      longueur_cm: ['', [Validators.required]],  // Latitude de l'adresse
      largeur_cm: ['', [Validators.required]],  // Longitude de l'adresse
      hauteur_cm: ['', [Validators.required]],  // Longitude de l'adresse
      poids_grammes: ['', [Validators.required]],  // Longitude de l'adresse
      idProduct: ['', [Validators.required]],  // ID du produit
      enseigne: ['', [Validators.required]],  // Article commandé
      destination_enseigne: ['', [Validators.required]],  // Article commandé
      iduser: ['', [Validators.required]],  // ID de l'utilisateur
      date_ajoutsystem: [{ value: new Date().toISOString().split('T')[0], disabled: true }, [Validators.required]] // Champ caché avec la date système
    });
  }

  

  // Soumettre le formulaire pour créer une commande
  addOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValues = this.orderForm.value;

    // Append form data values
    for (const key in formValues) {
      if (formValues[key]) {
        formData.append(key, formValues[key]);
      }
    }

  

    // Extracting iduser and idProduct from the form
    const iduser = formValues.iduser;
    const idproduit = formValues.idProduct;

    // Construct the API URL dynamically
    const url = `http://localhost:8764/Commande/createUP/${iduser}/${idproduit}`;

    // Envoi de la requête POST
    this.http.post(url, formData).subscribe({
      next: (res: any) => {
        console.log("Réponse de l'API :", res);
        alert("Commande ajoutée avec succès ! ");
        if (res.status === 'success') {
          alert('Commande ajoutée avec succès !');

          this.orderForm.reset();
        }
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la commande :", err);
        alert(err.error?.message || "Erreur lors de l'ajout de la commande.");
      }
    });
  }
    
    
}
*/









/* correct 
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllmyservicesService, Commande } from 'src/app/services/allmyservices.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {
  orderForm: FormGroup;
  selectedFile: File | null = null;
  gouvernorat: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Créer une date pour la Tunisie (UTC+1) avec ajustement de +1 heure
    const date = new Date();
  
    // Ajouter 1 heure pour corriger le décalage
    const adjustedDate = new Date(date.getTime() + (1 * 60 * 60 * 1000));
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Africa/Tunis' // Forcer le fuseau horaire de la Tunisie
    };
  
    // Obtenir la date formatée pour la Tunisie
    const dateString = adjustedDate.toLocaleString('fr-TN', options);
    console.log(`Sortie brute de toLocaleString (après ajustement +1h): ${dateString}`);
  
    // Fractionner la chaîne pour extraire les parties
    const dateParts = dateString.split(/[,/: ]+/);
    console.log(`Parties de la date:`, dateParts);
  
    // Vérifier que les parties sont correctes
    if (dateParts.length < 6) {
      console.error('Erreur : Format de date inattendu dans toLocaleString');
      return;
    }
  
    // Formater au format YYYY-MM-DDTHH:mm:ss
    const dateFormatee = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${dateParts[3]}:${dateParts[4]}:${dateParts[5]}`;
    console.log(`Valeur initiale de date_ajoutsystem (Tunisie, UTC+1): ${dateFormatee}`);
  
    // Vérification supplémentaire : comparer avec l'heure système
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    console.log(`Fuseau horaire système: UTC${-offsetMinutes / 60 >= 0 ? '+' : ''}${-offsetMinutes / 60}`);
  
    this.orderForm = this.fb.group({
      dateCommande: ['', [Validators.required]],
      adresse_livraison: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.min(0)]],
      articel_commande: ['', [Validators.required]],
      date_livraison_estimee: ['', [Validators.required]],
      ispaied: [false, [Validators.required]],
      longueur_cm: ['', [Validators.required]],
      largeur_cm: ['', [Validators.required]],
      hauteur_cm: ['', [Validators.required]],
      poids_grammes: ['', [Validators.required]],
      idProduct: ['', [Validators.required]],
      enseigne: ['', [Validators.required]],
      destination_enseigne: ['', [Validators.required]],
      iduser: ['', [Validators.required]],
      gouvernoratCmd: ['', [Validators.required]],
      date_ajoutsystem: [dateFormatee, [Validators.required]] // Date ajustée
    });
  }

  // Soumettre le formulaire pour créer une commande
  addOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    const formValues = this.orderForm.value;
  
    console.log('Données du formulaire avant envoi:', formValues);
    console.log('Valeur de date_ajoutsystem envoyée à l\'API:', formValues.date_ajoutsystem);
  
    for (const key in formValues) {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key].toString());
      }
    }
  
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }
  
    const iduser = formValues.iduser;
    const idproduit = formValues.idProduct;
    const url = `http://localhost:8764/Commande/createUP/${iduser}/${idproduit}`;
  
    this.http.post(url, formData).subscribe({
      next: (res: any) => {
        console.log("Réponse de l'API :", res);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order added successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        this.orderForm.reset();
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la commande :", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || "Error adding the order.",
          confirmButtonText: 'OK'
        });
      }
    });
  }
}*/

/*
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommandeNotifService } from 'src/app/services/commande-notif.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  deliveryForm: FormGroup;
  gouvernorat: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  deliveryOptions = [
    { value: 'STANDARD', label: 'Standard ', supplement: 0.0, totalFee: 0.0 },
    { value: 'EXPRESS', label: 'Express ', supplement: 5.0, totalFee: 0.0 },
    { value: 'WEEKEND', label: 'Weekend Only', supplement: 2.5, totalFee: 0.0 },
    { value: 'WEEKEND_EXPRESS', label: 'Weekend + Express', supplement: 7.5, totalFee: 0.0 }
  ];
  notificationMessage = '';
  showNotification = false;
  showDeliveryOptions = false;
  token: string = '';
  private subscription: Subscription | null = null;
  private formSubscription: Subscription | null = null;

  // Partner and client details
  partnerPhone: string = '';
  partnerEnseigne: string = '';
  partnerAddress: string = '';
  clientDetails: {
    firstName: string;
    lastName: string;
    phone: string;
    adresse_livraison: string;
    gouvernorat?: string;
    latitude?: number;
  } | null = null;

  // Delivery display properties
  selectedDeliveryLabel: string = 'Not selected';
  selectedDeliveryCost: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private webSocketService: CommandeNotifService
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.orderForm = this.fb.group({
      dateCommande: [today, [Validators.required]],
      adresse_livraison: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.min(0)]],
      fraisLivraison: [0, [Validators.min(0)]],
      remise: [0, [Validators.min(0)]],
      articel_commande: ['', [Validators.required]],
      date_livraison_estimee: ['', [Validators.required]],
      ispaied: [false, [Validators.required]],
      longueur_cm: [0, [Validators.min(0)]],
      largeur_cm: [0, [Validators.min(0)]],
      hauteur_cm: [0, [Validators.min(0)]],
      poids_grammes: ['', [Validators.required, Validators.min(0)]],
      enseigne: ['', [Validators.required]],
      destination_enseigne: ['', [Validators.required]],
      iduser: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gouvernoratCmd: ['', [Validators.required]],
      idpartenaire: ['', [Validators.required]],
      statut_commande: ['PENDING', [Validators.required]],
      latitude: [0, [Validators.min(0)]],
      date_ajoutsystem: ['']
    });

    this.deliveryForm = this.fb.group({
      deliveryOption: ['', [Validators.required]]
    });

    // Update delivery details when deliveryOption changes
    this.deliveryForm.get('deliveryOption')?.valueChanges.subscribe(value => {
      console.log('Delivery option changed to:', value);
      this.updateSelectedDeliveryDetails();
    });
  }

  private updateSelectedDeliveryDetails(): void {
    const selectedValue = this.deliveryForm.value.deliveryOption?.toUpperCase();
    const selectedOption = this.deliveryOptions.find(
      opt => opt.value.toUpperCase() === selectedValue
    );
    this.selectedDeliveryLabel = selectedOption ? selectedOption.label : 'Not selected';
    this.selectedDeliveryCost = selectedOption ? selectedOption.totalFee : 0;
    console.log('Updated delivery details:', {
      label: this.selectedDeliveryLabel,
      cost: this.selectedDeliveryCost
    });
    this.orderForm.updateValueAndValidity({ emitEvent: false });
  }

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.currentUser;
    this.token = localStorage.getItem('token') || '';

    if (!currentUser || !currentUser.iduser || localStorage.getItem('role')?.toUpperCase() !== 'ROLE_PARTNER') {
      console.error('No partner logged in!', { currentUser, role: localStorage.getItem('role') });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No partner logged in. Please log in as a partner.',
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    // Log dateCommande initial value
    console.log('dateCommande initialized to:', this.orderForm.value.dateCommande);

    // Fetch partner details with retry
    await this.fetchPartnerDetailsWithRetry(currentUser.iduser.toString(), 2);

    this.orderForm.patchValue({
      idpartenaire: currentUser.iduser.toString(),
      enseigne: this.partnerEnseigne
    });

    const idpartenaireValue = this.orderForm.get('idpartenaire')?.value;
    if (!idpartenaireValue) {
      console.error('Failed to set idpartenaire in form');
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Unable to set partner ID. Please try logging in again.',
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    // Subscribe to enseigne changes
    this.formSubscription = this.orderForm.get('enseigne')?.valueChanges.subscribe(value => {
      this.partnerEnseigne = value || this.authService.currentUser?.enseigne || 'Default Store';
      console.log('enseigne updated:', this.partnerEnseigne);
    });

    this.webSocketService.connect(currentUser.iduser.toString(), this.token);
    this.subscription = this.webSocketService.notifications$.subscribe(notification => {
      this.showNotification = true;
      this.notificationMessage = notification.content;
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    });

    // Fetch client details when iduser changes
    this.orderForm.get('iduser')?.valueChanges.subscribe(iduser => {
      if (iduser && /^[0-9]+$/.test(iduser)) {
        this.fetchClientDetails(iduser);
      } else {
        this.clientDetails = null;
        console.log('Invalid or empty iduser:', iduser);
      }
    });
  }

  private async fetchPartnerDetailsWithRetry(iduser: string, retries: number): Promise<void> {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
        const response = await this.http.get<any>(
          `http://localhost:8762/User/getuser/${iduser}`,
          { headers }
        ).toPromise();
        
        console.log('Partner API response:', response);

        // Relaxed role check
        const validRoles = ['ROLE_partner', 'ROLE_PARTNER', 'partner', 'PARTNER'];
        if (!response || !validRoles.includes(response.role?.toUpperCase())) {
          throw new Error(`Invalid partner data or role: ${response?.role}`);
        }

        this.partnerPhone = response.phone || response.telephone || response.mobile || this.authService.currentUser?.phone || '+21600000000';
        this.partnerEnseigne = response.enseigne || response.storeName || response.brand || response.store || this.authService.currentUser?.enseigne || 'Default Store';
        this.partnerAddress = response.address || this.authService.currentUser?.address || 'Unknown';
        console.log('Partner details fetched:', {
          phone: this.partnerPhone,
          enseigne: this.partnerEnseigne,
          address: this.partnerAddress
        });
        
        this.orderForm.patchValue({ enseigne: this.partnerEnseigne });
        return;
      } catch (err: any) {
        console.error(`Attempt ${attempt} failed fetching partner details:`, {
          iduser,
          error: err.message,
          status: err.status,
          response: err.error
        });
        if (attempt === retries + 1) {
          this.partnerPhone = this.authService.currentUser?.phone || '+21600000000';
          this.partnerEnseigne = this.authService.currentUser?.enseigne || 'Default Store';
          this.partnerAddress = this.authService.currentUser?.address || 'Unknown';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to fetch partner details for ID ${iduser} after ${retries + 1} attempts. Using defaults.`,
            confirmButtonColor: '#4caf50'
          });
        } else {
          console.log(`Retrying fetchPartnerDetails (${attempt + 1}/${retries + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  async fetchClientDetails(iduser: string): Promise<void> {
    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      const response = await this.http.get<any>(
        `http://localhost:8762/User/getuser/${iduser}`,
        { headers }
      ).toPromise();
      
      console.log('Client API response:', response);

      this.clientDetails = {
        firstName: response.firstname || 'Unknown',
        lastName: response.lastname || 'Unknown',
        phone: response.phone || response.telephone || response.mobile || '+21600000000',
        adresse_livraison: response.address || 'Unknown',
        gouvernorat: response.gouvernorat || 'Unknown',
        latitude: response.latitude || 0
      };
      console.log('Client details fetched:', this.clientDetails);
      this.orderForm.patchValue({
        adresse_livraison: this.clientDetails.adresse_livraison,
        gouvernoratCmd: this.clientDetails.gouvernorat,
        latitude: this.clientDetails.latitude
      });
    } catch (err: any) {
      console.error('Error fetching client details:', {
        iduser,
        error: err.message,
        status: err.status,
        response: err.error
      });
      this.clientDetails = null;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to fetch client details for ID ${iduser}.`,
        confirmButtonColor: '#4caf50'
      });
    }
  }

  async onNext(): Promise<void> {
    const idpartenaireValue = this.orderForm.get('idpartenaire')?.value;
    console.log('idpartenaire value before validation:', idpartenaireValue);

    if (this.orderForm.invalid || !this.clientDetails) {
      this.orderForm.markAllAsTouched();
      const invalidFields: string[] = [];
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        if (control?.invalid) {
          console.log(`Field ${key} is invalid:`, control.errors);
          invalidFields.push(`${key}: ${JSON.stringify(control.errors)}`);
        }
      });
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        html: `Please fill in all required fields correctly${!this.clientDetails ? ' and ensure a valid client ID' : ''}:<br>${invalidFields.join('<br>')}`,
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    await this.calculateAllDeliveryFees();
    this.showDeliveryOptions = true;
    this.deliveryForm.patchValue({ deliveryOption: 'STANDARD' });
    this.updateSelectedDeliveryDetails();
  }

  goBackToForm(): void {
    this.showDeliveryOptions = false;
    this.deliveryForm.reset();
    this.updateSelectedDeliveryDetails();
  }

  async calculateAllDeliveryFees(): Promise<void> {
    const poids_grammes = this.orderForm.value.poids_grammes;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

    try {
      const feePromises = this.deliveryOptions.map(option =>
        this.http.get<number>(
          `http://localhost:8764/Commande/calculate-fees?poids_grammes=${poids_grammes}&deliveryOption=${option.value}`,
          { headers }
        ).toPromise()
      );

      const fees = await Promise.all(feePromises);
      this.deliveryOptions.forEach((option, index) => {
        option.totalFee = fees[index] || 0;
        console.log(`Total fee for ${option.value}: ${option.totalFee} DNT`);
      });
    } catch (err: any) {
      console.error('Error calculating fees:', {
        error: err.message,
        status: err.status,
        response: err.error
      });
      this.deliveryOptions.forEach(option => {
        let fraisBase = 5.0;
        if (poids_grammes < 1000) fraisBase += 1.0;
        else if (poids_grammes <= 3000) fraisBase += 2.0;
        else if (poids_grammes <= 5000) fraisBase += 3.0;
        else if (poids_grammes <= 10000) fraisBase += 4.0;
        else fraisBase += 30.0;
        switch (option.value) {
          case 'EXPRESS': fraisBase += 5.0; break;
          case 'WEEKEND': fraisBase += 2.5; break;
          case 'WEEKEND_EXPRESS': fraisBase += 7.5; break;
        }
        option.totalFee = fraisBase;
        console.log(`Fallback total fee for ${option.value}: ${option.totalFee} DNT`);
      });
    }
    this.updateSelectedDeliveryDetails();
  }

  async previewDeliveryFees(deliveryOption: string): Promise<number> {
    const poids_grammes = this.orderForm.value.poids_grammes;
    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      const frais = await this.http.get<number>(
        `http://localhost:8764/Commande/calculate-fees?poids_grammes=${poids_grammes}&deliveryOption=${deliveryOption}`,
        { headers }
      ).toPromise();
      console.log(`Delivery fees calculated: ${frais} DNT for ${deliveryOption}`);
      return frais || 0;
    } catch (err: any) {
      console.error('Error calculating fees:', {
        error: err.message,
        status: err.status,
        response: err.error
      });
      let fraisBase = 5.0;
      if (poids_grammes < 1000) fraisBase += 1.0;
        else if (poids_grammes <= 3000) fraisBase += 2.0;
        else if (poids_grammes <= 5000) fraisBase += 3.0;
        else if (poids_grammes <= 10000) fraisBase += 4.0;
        else fraisBase += 30.0;
        switch (deliveryOption) {
          case 'EXPRESS': fraisBase += 5.0; break;
          case 'WEEKEND': fraisBase += 2.5; break;
          case 'WEEKEND_EXPRESS': fraisBase += 7.5; break;
        }
        console.log(`Fallback delivery fees: ${fraisBase} DNT for ${deliveryOption}`);
        return fraisBase;
      }
    }
  
    async submitOrder(): Promise<void> {
      if (this.deliveryForm.invalid) {
        this.deliveryForm.markAllAsTouched();
        Swal.fire({
          icon: 'error',
          title: 'Invalid Selection',
          text: 'Please select a delivery option.',
          confirmButtonColor: '#4caf50'
        });
        return;
      }
  
      const selectedOption = this.deliveryOptions.find(option => option.value === this.deliveryForm.value.deliveryOption);
      const frais = selectedOption?.totalFee || await this.previewDeliveryFees(this.deliveryForm.value.deliveryOption);
  
      this.orderForm.patchValue({ fraisLivraison: frais });
  
      Swal.fire({
        icon: 'info',
        title: 'Delivery Option Selected',
        text: `You selected ${selectedOption?.label} with delivery fees of ${frais.toFixed(2)} DNT.`,
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.addOrder();
      });
    }
  
    addOrder(): void {
      if (this.orderForm.invalid || !this.clientDetails) {
        this.orderForm.markAllAsTouched();
        Swal.fire({
          icon: 'error',
          title: 'Invalid Form',
          text: 'Please ensure all required fields are valid and client details are fetched.',
          confirmButtonColor: '#4caf50'
        });
        return;
      }
  
      // Set date_ajoutsystem to current local system date and time (CET)
      const now = new Date();
      const systemDate = format(now, "yyyy-MM-dd'T'HH:mm:ss"); // e.g., 2025-05-18T02:43:00
      this.orderForm.patchValue({ date_ajoutsystem: systemDate });
  
      const formData = new FormData();
      const formValues = this.orderForm.value;
  
      console.log('Form data before submission:', formValues);
      console.log('Partner ID sent (idpartenaire):', formValues.idpartenaire);
      console.log('Customer ID sent (iduser):', formValues.iduser);
      console.log('Delivery fees (fraisLivraison):', formValues.fraisLivraison);
      console.log('Discount (remise):', formValues.remise);
      console.log('dateCommande sent:', formValues.dateCommande);
      console.log('date_ajoutsystem sent:', formValues.date_ajoutsystem);
      console.log('enseigne sent:', formValues.enseigne);
  
      // Explicitly add date_ajoutsystem to FormData
      formData.append('date_ajoutsystem', systemDate);
  
      for (const key in formValues) {
        if (formValues[key] !== null && formValues[key] !== undefined && key !== 'date_ajoutsystem') {
          if (['total', 'fraisLivraison', 'remise', 'longueur_cm', 'largeur_cm', 'hauteur_cm', 'poids_grammes', 'latitude'].includes(key)) {
            formData.append(key, Number(formValues[key]).toString());
          } else if (key === 'ispaied') {
            formData.append(key, formValues[key].toString());
          } else {
            formData.append(key, formValues[key].toString());
          }
        }
      }
  
      formData.append('recipientFirstName', this.clientDetails.firstName);
      formData.append('recipientLastName', this.clientDetails.lastName);
      formData.append('recipientPhone', this.clientDetails.phone);
      formData.append('deliveryOption', this.deliveryForm.value.deliveryOption);
  
      console.log('FormData entries:');
      const formDataKeys = [
        'dateCommande', 'date_ajoutsystem', 'adresse_livraison', 'total', 'fraisLivraison', 'remise',
        'articel_commande', 'date_livraison_estimee', 'ispaied', 'longueur_cm',
        'largeur_cm', 'hauteur_cm', 'poids_grammes', 'enseigne',
        'destination_enseigne', 'iduser', 'gouvernoratCmd', 'idpartenaire',
        'statut_commande', 'latitude', 'recipientFirstName', 'recipientLastName',
        'recipientPhone', 'deliveryOption'
      ];
      formDataKeys.forEach(key => {
        const value = formData.get(key);
        console.log(`${key}: ${value !== null ? value : 'null'}`);
      });
  
      const iduser = formValues.iduser;
      const url = `http://localhost:8764/Commande/create/${iduser}`;
  
      console.log('Sending POST request to:', url);
  
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  
      this.http.post(url, formData, { headers }).subscribe({
        next: (res: any) => {
          console.log('API response:', res);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Order added successfully!',
            timer: 2000,
            showConfirmButton: false
          });
          this.orderForm.reset();
          this.deliveryForm.reset();
          this.showDeliveryOptions = false;
          this.clientDetails = null;
          this.updateSelectedDeliveryDetails();
          this.orderForm.patchValue({
            idpartenaire: this.authService.currentUser?.iduser?.toString() || '',
            enseigne: this.partnerEnseigne,
            statut_commande: 'PENDING',
            dateCommande: new Date().toISOString().split('T')[0],
            date_ajoutsystem: ''
          });
          console.log('dateCommande reset to:', this.orderForm.value.dateCommande);
          console.log('date_ajoutsystem reset to:', this.orderForm.value.date_ajoutsystem);
        },
        error: (err) => {
          console.error('Failed to add order: Status', err.status, 'Error:', err.error);
          const errorMessage = err.error?.error || err.error?.message || JSON.stringify(err.error) || 'Error adding the order. Please check the console for details.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#4caf50'
          });
        }
      });
    }
  
    resetForm(): void {
      this.orderForm.reset();
      this.deliveryForm.reset();
      this.showDeliveryOptions = false;
      this.clientDetails = null;
      this.deliveryOptions.forEach(option => option.totalFee = 0.0);
      this.updateSelectedDeliveryDetails();
      const idpartenaire = this.authService.currentUser?.iduser?.toString() || '';
      const today = new Date().toISOString().split('T')[0];
      console.log('Resetting form with idpartenaire:', idpartenaire, 'dateCommande:', today);
      this.orderForm.patchValue({
        idpartenaire: idpartenaire,
        enseigne: this.partnerEnseigne,
        statut_commande: 'PENDING',
        dateCommande: today,
        date_ajoutsystem: ''
      });
      if (!idpartenaire) {
        console.error('idpartenaire is empty after reset');
        Swal.fire({
          icon: 'error',
          title: 'Form Error',
          text: 'Unable to reset form with valid partner ID. Please try logging in again.',
          confirmButtonColor: '#4caf50'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    }
  
    ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.formSubscription?.unsubscribe();
      this.webSocketService.disconnect();
    }
  
    onDeliveryOptionChange(): void {
      console.log('Manual delivery option change triggered');
      this.updateSelectedDeliveryDetails();
    }
  }
    */


  import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommandeNotifService } from 'src/app/services/commande-notif.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  deliveryForm: FormGroup;
  gouvernorat: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];
  deliveryOptions = [
    { value: 'STANDARD', label: 'Standard ', supplement: 0.0, totalFee: 0.0 },
    { value: 'EXPRESS', label: 'Express ', supplement: 5.0, totalFee: 0.0 },
    { value: 'WEEKEND', label: 'Weekend Only', supplement: 2.5, totalFee: 0.0 },
    { value: 'WEEKEND_EXPRESS', label: 'Weekend + Express', supplement: 7.5, totalFee: 0.0 }
  ];
  notificationMessage = '';
  showNotification = false;
  showDeliveryOptions = false;
  token: string = '';
  private subscription: Subscription | null = null;
  private formSubscription: Subscription | null = null;

  // Partner and client details
  partnerPhone: string = '';
  partnerEnseigne: string = '';
  partnerAddress: string = '';
  clientDetails: {
    firstName: string;
    lastName: string;
    phone: string;
    adresse_livraison: string;
    gouvernorat?: string;
    latitude?: number;
  } | null = null;

  // Delivery display properties
  selectedDeliveryLabel: string = 'Not selected';
  selectedDeliveryCost: number = 0;
  // Store order ID and form data for invoice
  lastOrderId: string | null = null;
  lastFormValues: any = null;
  lastDeliveryOption: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private webSocketService: CommandeNotifService
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.orderForm = this.fb.group({
      dateCommande: [today, [Validators.required]],
      adresse_livraison: ['', [Validators.required]],
      total: ['', [Validators.required, Validators.min(0)]],
      fraisLivraison: [0, [Validators.min(0)]],
      remise: [0, [Validators.min(0)]],
      articel_commande: ['', [Validators.required]],
      date_livraison_estimee: ['', [Validators.required]],
      ispaied: [false, [Validators.required]],
      longueur_cm: [0, [Validators.min(0)]],
      largeur_cm: [0, [Validators.min(0)]],
      hauteur_cm: [0, [Validators.min(0)]],
      poids_grammes: ['', [Validators.required, Validators.min(0)]],
      enseigne: ['', [Validators.required]],
      destination_enseigne: ['', [Validators.required]],
      iduser: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      gouvernoratCmd: ['', [Validators.required]],
      idpartenaire: ['', [Validators.required]],
      statut_commande: ['PENDING', [Validators.required]],
      latitude: [0, [Validators.min(0)]],
      date_ajoutsystem: ['']
    });

    this.deliveryForm = this.fb.group({
      deliveryOption: ['', [Validators.required]]
    });

    // Update delivery details when deliveryOption changes
    this.deliveryForm.get('deliveryOption')?.valueChanges.subscribe(value => {
      console.log('Delivery option changed to:', value);
      this.updateSelectedDeliveryDetails();
    });
  }

  private updateSelectedDeliveryDetails(): void {
    const selectedValue = this.deliveryForm.value.deliveryOption?.toUpperCase();
    const selectedOption = this.deliveryOptions.find(
      opt => opt.value.toUpperCase() === selectedValue
    );
    this.selectedDeliveryLabel = selectedOption ? selectedOption.label : 'Not selected';
    this.selectedDeliveryCost = selectedOption ? selectedOption.totalFee : 0;
    console.log('Updated delivery details:', {
      label: this.selectedDeliveryLabel,
      cost: this.selectedDeliveryCost
    });
    this.orderForm.updateValueAndValidity({ emitEvent: false });
  }

  async ngOnInit(): Promise<void> {
    const currentUser = this.authService.currentUser;
    this.token = localStorage.getItem('token') || '';

    if (!currentUser || !currentUser.iduser || localStorage.getItem('role')?.toUpperCase() !== 'ROLE_PARTNER') {
      console.error('No partner logged in!', { currentUser, role: localStorage.getItem('role') });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No partner logged in. Please log in as a partner.',
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    // Log dateCommande initial value
    console.log('dateCommande initialized to:', this.orderForm.value.dateCommande);

    // Fetch partner details with retry
    await this.fetchPartnerDetailsWithRetry(currentUser.iduser.toString(), 2);

    this.orderForm.patchValue({
      idpartenaire: currentUser.iduser.toString(),
      enseigne: this.partnerEnseigne
    });

    const idpartenaireValue = this.orderForm.get('idpartenaire')?.value;
    if (!idpartenaireValue) {
      console.error('Failed to set idpartenaire in form');
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Unable to set partner ID. Please try logging in again.',
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    // Subscribe to enseigne changes
    this.formSubscription = this.orderForm.get('enseigne')?.valueChanges.subscribe(value => {
      this.partnerEnseigne = value || this.authService.currentUser?.enseigne || 'Default Store';
      console.log('enseigne updated:', this.partnerEnseigne);
    });

    this.webSocketService.connect(currentUser.iduser.toString(), this.token);
    this.subscription = this.webSocketService.notifications$.subscribe(notification => {
      this.showNotification = true;
      this.notificationMessage = notification.content;
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    });

    // Fetch client details when iduser changes
    this.orderForm.get('iduser')?.valueChanges.subscribe(iduser => {
      if (iduser && /^[0-9]+$/.test(iduser)) {
        this.fetchClientDetails(iduser);
      } else {
        this.clientDetails = null;
        console.log('Invalid or empty iduser:', iduser);
      }
    });
  }

  private async fetchPartnerDetailsWithRetry(iduser: string, retries: number): Promise<void> {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
        const response = await this.http.get<any>(
          `http://localhost:8762/User/getuser/${iduser}`,
          { headers }
        ).toPromise();
        
        console.log('Partner API response:', response);

        // Relaxed role check
        const validRoles = ['ROLE_partner', 'ROLE_PARTNER', 'partner', 'PARTNER'];
        if (!response || !validRoles.includes(response.role?.toUpperCase())) {
          throw new Error(`Invalid partner data or role: ${response?.role}`);
        }

        this.partnerPhone = response.phone || response.telephone || response.mobile || this.authService.currentUser?.phone || '+21600000000';
        this.partnerEnseigne = response.enseigne || response.storeName || response.brand || response.store || this.authService.currentUser?.enseigne || '';
        this.partnerAddress = response.address || this.authService.currentUser?.address || 'Unknown';
        console.log('Partner details fetched:', {
          phone: this.partnerPhone,
          enseigne: this.partnerEnseigne,
          address: this.partnerAddress
        });
        
        this.orderForm.patchValue({ enseigne: this.partnerEnseigne });
        return;
      } catch (err: any) {
        console.error(`Attempt ${attempt} failed fetching partner details:`, {
          iduser,
          error: err.message,
          status: err.status,
          response: err.error
        });
        if (attempt === retries + 1) {
          this.partnerPhone = this.authService.currentUser?.phone || '+21600000000';
          this.partnerEnseigne = this.authService.currentUser?.enseigne || 'Default Store';
          this.partnerAddress = this.authService.currentUser?.address || 'Unknown';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Failed to fetch partner details for ID ${iduser} after ${retries + 1} attempts. Using defaults.`,
            confirmButtonColor: '#4caf50'
          });
        } else {
          console.log(`Retrying fetchPartnerDetails (${attempt + 1}/${retries + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }

  async fetchClientDetails(iduser: string): Promise<void> {
    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      const response = await this.http.get<any>(
        `http://localhost:8762/User/getuser/${iduser}`,
        { headers }
      ).toPromise();
      
      console.log('Client API response:', response);

      this.clientDetails = {
        firstName: response.firstname || 'Unknown',
        lastName: response.lastname || 'Unknown',
        phone: response.phone || response.telephone || response.mobile || '+21600000000',
        adresse_livraison: response.address || 'Unknown',
        gouvernorat: response.gouvernorat || 'Unknown',
        latitude: response.latitude || 0
      };
      console.log('Client details fetched:', this.clientDetails);
      this.orderForm.patchValue({
        adresse_livraison: this.clientDetails.adresse_livraison,
        gouvernoratCmd: this.clientDetails.gouvernorat,
        latitude: this.clientDetails.latitude
      });
    } catch (err: any) {
      console.error('Error fetching client details:', {
        iduser,
        error: err.message,
        status: err.status,
        response: err.error
      });
      this.clientDetails = null;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to fetch client details for ID ${iduser}.`,
        confirmButtonColor: '#4caf50'
      });
    }
  }

  async onNext(): Promise<void> {
    const idpartenaireValue = this.orderForm.get('idpartenaire')?.value;
    console.log('idpartenaire value before validation:', idpartenaireValue);

    if (this.orderForm.invalid || !this.clientDetails) {
      this.orderForm.markAllAsTouched();
      const invalidFields: string[] = [];
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        if (control?.invalid) {
          console.log(`Field ${key} is invalid:`, control.errors);
          invalidFields.push(`${key}: ${JSON.stringify(control.errors)}`);
        }
      });
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        html: `Please fill in all required fields correctly${!this.clientDetails ? ' and ensure a valid client ID' : ''}:<br>${invalidFields.join('<br>')}`,
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    await this.calculateAllDeliveryFees();
    this.showDeliveryOptions = true;
    this.deliveryForm.patchValue({ deliveryOption: 'STANDARD' });
    this.updateSelectedDeliveryDetails();
  }

  goBackToForm(): void {
    this.showDeliveryOptions = false;
    this.deliveryForm.reset();
    this.updateSelectedDeliveryDetails();
  }

  async calculateAllDeliveryFees(): Promise<void> {
    const poids_grammes = this.orderForm.value.poids_grammes;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

    try {
      const feePromises = this.deliveryOptions.map(option =>
        this.http.get<number>(
          `http://localhost:8764/Commande/calculate-fees?poids_grammes=${poids_grammes}&deliveryOption=${option.value}`,
          { headers }
        ).toPromise()
      );

      const fees = await Promise.all(feePromises);
      this.deliveryOptions.forEach((option, index) => {
        option.totalFee = fees[index] || 0;
        console.log(`Total fee for ${option.value}: ${option.totalFee} DNT`);
      });
    } catch (err: any) {
      console.error('Error calculating fees:', {
        error: err.message,
        status: err.status,
        response: err.error
      });
      this.deliveryOptions.forEach(option => {
        let fraisBase = 5.0;
        if (poids_grammes < 1000) fraisBase += 1.0;
        else if (poids_grammes <= 3000) fraisBase += 2.0;
        else if (poids_grammes <= 5000) fraisBase += 3.0;
        else if (poids_grammes <= 10000) fraisBase += 4.0;
        else fraisBase += 30.0;
        switch (option.value) {
          case 'EXPRESS': fraisBase += 5.0; break;
          case 'WEEKEND': fraisBase += 2.5; break;
          case 'WEEKEND_EXPRESS': fraisBase += 7.5; break;
        }
        option.totalFee = fraisBase;
        console.log(`Fallback total fee for ${option.value}: ${option.totalFee} DNT`);
      });
    }
    this.updateSelectedDeliveryDetails();
  }

  async previewDeliveryFees(deliveryOption: string): Promise<number> {
    const poids_grammes = this.orderForm.value.poids_grammes;
    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      const frais = await this.http.get<number>(
        `http://localhost:8764/Commande/calculate-fees?poids_grammes=${poids_grammes}&deliveryOption=${deliveryOption}`,
        { headers }
      ).toPromise();
      console.log(`Delivery fees calculated: ${frais} DNT for ${deliveryOption}`);
      return frais || 0;
    } catch (err: any) {
      console.error('Error calculating fees:', {
        error: err.message,
        status: err.status,
        response: err.error
      });
      let fraisBase = 5.0;
      if (poids_grammes < 1000) fraisBase += 1.0;
      else if (poids_grammes <= 3000) fraisBase += 2.0;
      else if (poids_grammes <= 5000) fraisBase += 3.0;
      else if (poids_grammes <= 10000) fraisBase += 4.0;
      else fraisBase += 30.0;
      switch (deliveryOption) {
        case 'EXPRESS': fraisBase += 5.0; break;
        case 'WEEKEND': fraisBase += 2.5; break;
        case 'WEEKEND_EXPRESS': fraisBase += 7.5; break;
      }
      console.log(`Fallback delivery fees: ${fraisBase} DNT for ${deliveryOption}`);
      return fraisBase;
    }
  }

  async submitOrder(): Promise<void> {
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Selection',
        text: 'Please select a delivery option.',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    const selectedOption = this.deliveryOptions.find(option => option.value === this.deliveryForm.value.deliveryOption);
    const frais = selectedOption?.totalFee || await this.previewDeliveryFees(this.deliveryForm.value.deliveryOption);

    this.orderForm.patchValue({ fraisLivraison: frais });

    Swal.fire({
      icon: 'info',
      title: 'Delivery Option Selected',
      text: `You selected ${selectedOption?.label} with delivery fees of ${frais.toFixed(2)} DNT.`,
      confirmButtonColor: '#4caf50'
    }).then(() => {
      this.addOrder();
    });
  }

  async generateInvoice(orderId: string): Promise<Blob> {
    const doc = new jsPDF();
    const formValues = this.lastFormValues;

    // Styling: Set fonts and colors
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102); // Dark blue
    doc.text('Invoice', 20, 20);

    // Header box
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 51, 102);
    doc.rect(15, 10, 180, 25); // Box around Invoice header
    doc.line(15, 35, 195, 35); // Line below header

    // Order Info (in a box)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: ${orderId}`, 20, 45);
    doc.text(`Date: ${formValues.date_ajoutsystem || 'N/A'}`, 20, 55);
    doc.setLineWidth(0.3);
    doc.rect(15, 35, 180, 25); // Box around Order Info

    // From and To Sections (side-by-side boxes)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('From:', 20, 70);
    doc.text('To:', 105, 70);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    // From (use enseigne, adresse_livraison, gouvernoratCmd)
    doc.text(`Brand: ${formValues.enseigne || 'N/A'}`, 20, 80);
    doc.text(`Phone: ${this.partnerPhone || 'N/A'}`, 20, 90);
    doc.text(`Address: ${formValues.adresse_livraison || 'N/A'}`, 20, 100);
    doc.text(`Governorate: ${formValues.gouvernoratCmd || 'N/A'}`, 20, 110);
    // To (use destination_enseigne, adresse_livraison, gouvernoratCmd)
    doc.text(`Brand: ${formValues.destination_enseigne || 'N/A'}`, 105, 80);
    doc.text(`Name: ${formValues.recipientFirstName || 'N/A'} ${formValues.recipientLastName || 'N/A'}`, 105, 90);
    doc.text(`Phone: ${formValues.recipientPhone || 'N/A'}`, 105, 100);
    doc.text(`Address: ${formValues.adresse_livraison || 'N/A'}`, 105, 110);
    doc.text(`Governorate: ${formValues.gouvernoratCmd || 'N/A'}`, 105, 120);

    // Boxes around From and To
    doc.rect(15, 60, 85, 65); // From box (increased height for governorate)
    doc.rect(100, 60, 95, 65); // To box (increased height for governorate)

    // Order Details Section (table-like with borders)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Order Details:', 20, 135);
    doc.setLineWidth(0.3);
    doc.line(15, 140, 195, 140); // Line below title

    // Table header
    doc.setFillColor(230, 230, 230); // Light gray
    doc.rect(15, 145, 180, 10, 'F'); // Filled header row
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, 152);
    doc.text('Value', 100, 152);

    // Table rows
    doc.setFont('helvetica', 'normal');
    const details = [
      { label: 'Item:', value: formValues.articel_commande || 'N/A' },
      { label: 'Total:', value: `${(formValues.total || 0).toFixed(2)} DNT` },
      { label: 'Delivery Fee:', value: `${(formValues.fraisLivraison || 0).toFixed(2)} DNT` },
      { label: 'Discount:', value: `${(formValues.remise || 0).toFixed(2)} DNT` },
      { label: 'Delivery Option:', value: this.lastDeliveryOption || 'N/A' },
      { label: 'Weight:', value: `${formValues.poids_grammes || 0} grams` },
      { label: 'Dimensions:', value: `${formValues.longueur_cm || 0} x ${formValues.largeur_cm || 0} x ${formValues.hauteur_cm || 0} cm` },
      { label: 'Estimated Delivery:', value: formValues.date_livraison_estimee || 'N/A' },
      { label: 'Paid:', value: formValues.ispaied ? 'Yes' : 'No' }
    ];

    let y = 155;
    details.forEach((detail, index) => {
      // Alternate row shading
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245); // Very light gray
        doc.rect(15, y, 180, 10, 'F');
      }
      doc.text(detail.label, 20, y + 7);
      doc.text(detail.value, 100, y + 7);
      doc.rect(15, y, 180, 10); // Row border
      y += 10;
    });

    // Outer box for Order Details
    doc.setLineWidth(0.5);
    doc.rect(15, 145, 180, y - 145);

    // Footer
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 51, 102);
    doc.line(15, 270, 195, 270);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by Delivery Management System', 20, 280);
    doc.text('Contact: support@deliveryapp.com', 20, 285);

    return doc.output('blob');
  }

  async storeInvoice(orderId: string, invoiceBlob: Blob): Promise<string> {
    // Note: This method is currently unused as backend storage is skipped
    const formData = new FormData();
    formData.append('invoice', invoiceBlob, `invoice_${orderId}.pdf`);
    formData.append('orderId', orderId);

    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      const response = await this.http.post<{ invoiceUrl: string }>(
        `http://localhost:8764/Commande/invoice/${orderId}`,
        formData,
        { headers }
      ).toPromise();
      console.log('Invoice stored:', response);
      return response.invoiceUrl;
    } catch (err: any) {
      console.error('Error storing invoice:', err);
      return '';
    }
  }

  async viewInvoice(): Promise<void> {
    if (!this.lastOrderId || !this.lastFormValues) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No order data available to generate invoice.',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    const invoiceBlob = await this.generateInvoice(this.lastOrderId);
    const invoiceUrl = URL.createObjectURL(invoiceBlob);
    const link = document.createElement('a');
    link.href = invoiceUrl;
    link.download = `invoice_${this.lastOrderId}.pdf`;
    link.click();
    URL.revokeObjectURL(invoiceUrl);

    // Backend storage skipped to avoid 404 error
    // Uncomment the following line if backend endpoint is implemented later
    // await this.storeInvoice(this.lastOrderId, invoiceBlob);
  }

  addOrder(): void {
    if (this.orderForm.invalid || !this.clientDetails) {
      this.orderForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please ensure all required fields are valid and client details are fetched.',
        confirmButtonColor: '#4caf50'
      });
      return;
    }

    // Set date_ajoutsystem to current local system date and time (CET)
    const now = new Date();
    const systemDate = format(now, "yyyy-MM-dd'T'HH:mm:ss");
    this.orderForm.patchValue({ date_ajoutsystem: systemDate });

    const formData = new FormData();
    const formValues = this.orderForm.value;

    console.log('Form data before submission:', formValues);
    console.log('Partner ID sent (idpartenaire):', formValues.idpartenaire);
    console.log('Customer ID sent (iduser):', formValues.iduser);
    console.log('Delivery fees (fraisLivraison):', formValues.fraisLivraison);
    console.log('Discount (remise):', formValues.remise);
    console.log('dateCommande sent:', formValues.dateCommande);
    console.log('date_ajoutsystem sent:', formValues.date_ajoutsystem);
    console.log('enseigne sent:', formValues.enseigne);

    formData.append('date_ajoutsystem', systemDate);

    for (const key in formValues) {
      if (formValues[key] !== null && formValues[key] !== undefined && key !== 'date_ajoutsystem') {
        if (['total', 'fraisLivraison', 'remise', 'longueur_cm', 'largeur_cm', 'hauteur_cm', 'poids_grammes', 'latitude'].includes(key)) {
          formData.append(key, Number(formValues[key]).toString());
        } else if (key === 'ispaied') {
          formData.append(key, formValues[key].toString());
        } else {
          formData.append(key, formValues[key].toString());
        }
      }
    }

    formData.append('recipientFirstName', this.clientDetails.firstName);
    formData.append('recipientLastName', this.clientDetails.lastName);
    formData.append('recipientPhone', this.clientDetails.phone);
    formData.append('deliveryOption', this.deliveryForm.value.deliveryOption);

    console.log('FormData entries:');
    const formDataKeys = [
      'dateCommande', 'date_ajoutsystem', 'adresse_livraison', 'total', 'fraisLivraison', 'remise',
      'articel_commande', 'date_livraison_estimee', 'ispaied', 'longueur_cm',
      'largeur_cm', 'hauteur_cm', 'poids_grammes', 'enseigne',
      'destination_enseigne', 'iduser', 'gouvernoratCmd', 'idpartenaire',
      'statut_commande', 'latitude', 'recipientFirstName', 'recipientLastName',
      'recipientPhone', 'deliveryOption'
    ];
    formDataKeys.forEach(key => {
      const value = formData.get(key);
      console.log(`${key}: ${value !== null ? value : 'null'}`);
    });

    const iduser = formValues.iduser;
    const url = `http://localhost:8764/Commande/createuser/${iduser}`;

    console.log('Sending POST request to:', url);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

    this.http.post<{ id_commande: string }>(url, formData, { headers }).subscribe({
      next: (res: any) => {
        // Enhanced logging to diagnose id_commande
        console.log('Full API response:', JSON.stringify(res, null, 2));
        // Use id_commande for orderId
        this.lastOrderId = res.id_commande ? String(res.id_commande) : 'unknown';
        console.log('Extracted lastOrderId:', this.lastOrderId);
        this.lastFormValues = {
          ...formValues,
          recipientFirstName: this.clientDetails?.firstName || 'Unknown',
          recipientLastName: this.clientDetails?.lastName || 'Unknown',
          recipientPhone: this.clientDetails?.phone || '+21600000000'
        };
        this.lastDeliveryOption = this.selectedDeliveryLabel;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order added successfully! You can now view the invoice.',
          timer: 2000,
          showConfirmButton: false
        });

        this.orderForm.reset();
        this.deliveryForm.reset();
        this.showDeliveryOptions = true; // Stay on delivery options to show invoice button
        this.clientDetails = null;
        this.updateSelectedDeliveryDetails();
        this.orderForm.patchValue({
          idpartenaire: this.authService.currentUser?.iduser?.toString() || '',
          enseigne: this.partnerEnseigne,
          statut_commande: 'PENDING',
          dateCommande: new Date().toISOString().split('T')[0],
          date_ajoutsystem: ''
        });
        console.log('dateCommande reset to:', this.orderForm.value.dateCommande);
        console.log('date_ajoutsystem reset to:', this.orderForm.value.date_ajoutsystem);
      },
      error: (err) => {
        console.error('Failed to add order: Status', err.status, 'Error:', err.error);
        const errorMessage = err.error?.error || err.error?.message || JSON.stringify(err.error) || 'Error adding the order. Please check the console for details.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#4caf50'
        });
      }
    });
  }

  resetForm(): void {
    this.orderForm.reset();
    this.deliveryForm.reset();
    this.showDeliveryOptions = false;
    this.clientDetails = null;
    this.lastOrderId = null;
    this.lastFormValues = null;
    this.lastDeliveryOption = null;
    this.deliveryOptions.forEach(option => option.totalFee = 0.0);
    this.updateSelectedDeliveryDetails();
    const idpartenaire = this.authService.currentUser?.iduser?.toString() || '';
    const today = new Date().toISOString().split('T')[0];
    console.log('Resetting form with idpartenaire:', idpartenaire, 'dateCommande:', today);
    this.orderForm.patchValue({
      idpartenaire: idpartenaire,
      enseigne: this.partnerEnseigne,
      statut_commande: 'PENDING',
      dateCommande: today,
      date_ajoutsystem: ''
    });
    if (!idpartenaire) {
      console.error('idpartenaire is empty after reset');
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Unable to reset form with valid partner ID. Please try logging in again.',
        confirmButtonColor: '#4caf50'
      }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

  onDeliveryOptionChange(): void {
    console.log('Manual delivery option change triggered');
    this.updateSelectedDeliveryDetails();
  }
}