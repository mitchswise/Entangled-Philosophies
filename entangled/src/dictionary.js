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
			if (lang == 'eng') return "English";
			if (lang == 'ger') return "Englisch";
			break;
        case 11:
            if(lang == 'eng') return "Save Changes";
            if(lang == 'ger') return "Änderungen speichern";
            break;
        case 12:
            if(lang == 'eng') return "Choose Language";
            if(lang == 'ger') return "Sprache Wählen";
            break;
        case 13:
            if(lang == 'eng') return "German";
            if(lang == 'ger') return "Deutsche";
            break;
		case 14:
			if(lang == 'eng') return "Confirm Password";
			if(lang == 'ger') return "German Confirm Password"; // PLACEHOLDER
		case 15:
			if(lang == 'eng') return "Delete Account";
			if(lang == 'ger') return "German Delete Account"; // PLACEHOLDER
		case 16:
			if(lang == 'eng') return "Login";
			if(lang == 'ger') return "Einloggen";
		case 17:
			if(lang == 'eng') return "Username";
			if(lang == 'ger') return "Benutzername";
		case 18:
			if(lang == 'eng') return "Password";
			if(lang == 'ger') return "Passwort";
		case 19:
			if(lang == 'eng') return "Log in";
			if(lang == 'ger') return "Einloggen";
		case 20:
			if(lang == 'eng') return "Don't have an account? ";
			if(lang == 'ger') return "Sie haben noch kein Konto? ";
		case 21:
			if(lang == 'eng') return "Forgot your password?";
			if(lang == 'ger') return "Passwort vergessen?";
		case 22:
			if(lang == 'eng') return "Register";
			if(lang == 'ger') return "Registrieren";
		case 23:
			if(lang == 'eng') return "Home";
			if(lang == 'ger') return "Startseite";
		case 24:
			if(lang == 'eng') return "Confirm Password";
			if(lang == 'ger') return "Passwort Bestätigen";
		case 25:
			if(lang == 'eng') return "Email";
			if(lang == 'ger') return "E-Mail";
		case 26:
			if(lang == 'eng') return "Create";
			if(lang == 'ger') return "Konto Erstellen";
		case 27:
			if(lang == 'eng') return "Already registered? ";
			if(lang == 'ger') return "Bereits registriert? ";
		default:
			return "?";
	}
}
