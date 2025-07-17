from zeep import Client

def main():
    wsdl_url = "http://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL"
    
    client = Client(wsdl=wsdl_url)
    
    try:
        numero = int(input("Digite um número inteiro: "))
        
        resultado = client.service.NumberToWords(ubiNum=numero)
        
        print(f"O número {numero} por extenso em inglês é: {resultado}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    main()
