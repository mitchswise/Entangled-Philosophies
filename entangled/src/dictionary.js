export function dSettings(s, lang) {
	switch(s) {
		case 1:
			if (lang == 'eng') return "Username";
			if (lang == 'ger') return "Benutzername";
			break;
		case 2:
			if (lang == 'eng') return "Email";
			if (lang == 'ger') return "E-Mail";
			break;
		case 3:
			if (lang == 'eng') return "Password";
			if (lang == 'ger') return "Passwort";
			break;
		case 4:
			if (lang == 'eng') return "Change Password";
			if (lang == 'ger') return "Passwort Ändern";
			break;
		case 5:
			if (lang == 'eng') return "Preferred Language";
			if (lang == 'ger') return "Bevorzugte Sprache";
			break;
		case 6:
			if (lang == 'eng') return "Cookies";
			if (lang == 'ger') return "Cookies";
			break;
		case 7:
			if (lang == 'eng') return "Opt In";
			if (lang == 'ger') return "Akzeptieren";
			break;
		case 8:
			if (lang == 'eng') return "Opt Out";
			if (lang == 'ger') return "Ablehnen";
			break;
		case 9:
			if (lang == 'eng') return "Account Settings";
			if (lang == 'ger') return "Kontoeinstellungen";
			break;
		case 10:
			if (lang == '') return "Choose Language";
			if (lang == 'eng') return "English";
			if (lang == 'ger') return "Deutsch";
			break;
		case 11:
			if (lang == 'eng') return "Change Email";
			if (lang == 'ger') return "E-Mail Ändern";
			break;
		case 12:
			if (lang == 'eng') return "New Email";
			if (lang == 'ger') return "Neue E-Mail";
			break;
		case 13:
			if (lang == 'eng') return "Save Changes";
			if (lang == 'ger') return "Änderungen Speichern";
			break;
		case 14:
			if (lang == 'eng') return "Example Username";
			if (lang == 'ger') return "Beispiel-Benutzername";
			break;
		case 15:
			if (lang == 'eng') return "New Password";
			if (lang == 'ger') return "Neue Passwort";
			break;
	}
}
