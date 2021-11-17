import { DateTime, Interval } from "luxon";
import {countries} from "./countries.js";
import {ageConditions} from "./age.js";

export const data = {nationality:countries, age:ageConditions }

const getAgeCondition = (claim) => {

	const getAge = (birthDate) => {
    	const now = DateTime.now();
    	const birthD = DateTime.fromISO(birthDate.split("-").reverse().join("-"));
    	const interval = Interval.fromDateTimes(birthD, now);
    	return interval.length("years");
	}

	const age = getAge(claim)
	if(age >= 18){
		return {
			conditionCategory: "age",
			condition: "LEGAL_AGE"
		}
	}else{
		return {
			conditionCategory: "age",
			condition: "UNDERAGE"
		}
	}
}

const getNationalityCondition = (country) => {
	const isInDB = countries.find((countrySupported) => {
    	return  countrySupported == country
	})

	if(!isInDB){
		throw new Error("country not in db");
	}
	return {
		conditionCategory: "nationality",
		condition: isInDB
	}
}


export const credential_country = "credential_country";

export const credential_birthday = "credential_birthday";

const credentialToFunction = {
	[credential_birthday]: getAgeCondition,
	[credential_country]: getNationalityCondition,

}

export const getCondition = (credential, claim) => {

	return credentialToFunction[credential](claim);
}