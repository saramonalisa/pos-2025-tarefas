import requests
from xml.dom.minidom import parseString

URL = "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso"

def get_country_iso_code(country_name):
    body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CountryISOCode xmlns="http://www.oorsprong.org/websamples.countryinfo">
      <sCountryName>{country_name}</sCountryName>
    </CountryISOCode>
  </soap:Body>
</soap:Envelope>"""

    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.oorsprong.org/websamples.countryinfo/CountryISOCode"
    }

    response = requests.post(URL, data=body, headers=headers)
    dom = parseString(response.text)
    iso_code = dom.getElementsByTagName("m:CountryISOCodeResult")[0].firstChild.nodeValue
    return iso_code

def get_capital_city(iso_code):
    body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CapitalCity xmlns="http://www.oorsprong.org/websamples.countryinfo">
      <sCountryISOCode>{iso_code}</sCountryISOCode>
    </CapitalCity>
  </soap:Body>
</soap:Envelope>"""

    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.oorsprong.org/websamples.countryinfo/CapitalCity"
    }

    response = requests.post(URL, data=body, headers=headers)
    dom = parseString(response.text)
    capital = dom.getElementsByTagName("m:CapitalCityResult")[0].firstChild.nodeValue
    return capital

def get_language_name(iso_code):
    body = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CountryLanguages xmlns="http://www.oorsprong.org/websamples.countryinfo">
      <sCountryISOCode>{iso_code}</sCountryISOCode>
    </CountryLanguages>
  </soap:Body>
</soap:Envelope>"""

    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://www.oorsprong.org/websamples.countryinfo/CountryLanguages"
    }

    response = requests.post(URL, data=body, headers=headers)
    dom = parseString(response.text)
    languages = dom.getElementsByTagName("m:sName")
    return [lang.firstChild.nodeValue for lang in languages]

def menu():
    while True:
        print("\nMENU:")
        print("1 - Obter código ISO do país")
        print("2 - Obter capital a partir do código ISO")
        print("3 - Obter idioma(s) a partir do código ISO")
        print("4 - Sair")

        opcao = input("Digite uma opção: ")

        if opcao == "1":
            nome = input("Digite o nome do país (ex: Brazil): ")
            try:
                iso = get_country_iso_code(nome)
                print(f"ISO Code: {iso}")
            except Exception as e:
                print(f"Erro: {e}")
        elif opcao == "2":
            iso = input("Digite o código ISO (ex: BR): ")
            try:
                capital = get_capital_city(iso)
                print(f"Capital: {capital}")
            except Exception as e:
                print(f"Erro: {e}")
        elif opcao == "3":
            iso = input("Digite o código ISO (ex: BR): ")
            try:
                idiomas = get_language_name(iso)
                print("Idiomas:")
