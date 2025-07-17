from zeep import Client

def main():
    wsdl_url = "http://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL"
    
    client = Client(wsdl=wsdl_url)
    
    try:
        number = int(input("Digite um número inteiro: "))
        
        result = client.service.NumberToWords(ubiNum=number)
        
        print(f"O número {number} por extenso em inglês é: {result}")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

if __name__ == "__main__":
    main()