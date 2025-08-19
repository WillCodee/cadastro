class ValidaFormulario{
    constructor(){
        this.formulario = document.querySelector('.formulario')
        this.eventos()
    }

    eventos(){
        this.formulario.addEventListener('submit',e => {
            this.handleSubmit(e)
        })
    }

    handleSubmit(e){
        e.preventDefault();
        const camposValidos = this.CamposSaoValidos()
        const senhasValidas = this.senhasSaoValidas()

        if(camposValidos && senhasValidas){
            //coletar os dados
            const dados = {};
            for(let campo of this.formulario.querySelectorAll('.validar')){
                const nome = campo.getAttribute('name');
                const valor = campo.value;

                // Se o campo não tiver "name", pula
                if (!nome) {
                    console.warn(`Campo sem atributo "name":`, campo);
                    continue;
                }

                if (nome !== 'repetir-senha') {
                    dados[nome] = valor;
                }
            }
            

            this.salvarDados(dados)
            alert('Formulario enviado')
            window.location.href="sucesso.html"
        }

    }

    salvarDados(novoDado){
        let dados = JSON.parse(localStorage.getItem('usuarios')) || []
        dados.push(novoDado)
        localStorage.setItem('usuarios',JSON.stringify(dados))
    }

    CamposSaoValidos(){
        let valid = true;

        for(let errorText of this.formulario.querySelectorAll('.error-text')){
            errorText.remove()
        }

        for(let campo of this.formulario.querySelectorAll('.validar')){
            const label = campo.previousElementSibling.innerText;

            if(!campo.value){
                this.criaErro(campo,`Campo: ${label} não pode ficar em Branco`)
                valid = false
            }

            if(campo.classList.contains('usuario')){
                if(!this.validaUsuario(campo)){
                    valid = false
                }
            }

            if(campo.classList.contains('cpf')){
                if(!this.validaCPF(campo)){
                    valid = false
                }
            }
        }

        return valid
    }

    validaUsuario(campo){
        let valid = true;
        const usuario = campo.value

        if(usuario.length < 3 || usuario.length > 12){
            this.criaErro(campo,'Usuário deve conter entre 3 e 12 caracteres')
            valid = false
        }
        if(!usuario.match(/^[a-zA-Z0-9]+$/g)){
            this.criaErro(campo,'Usuário deve conter apenas Letras e números')
            valid = false
        }

        return valid
    }

    senhasSaoValidas(){
        let valid = true;
        const senha = document.getElementById('senha')
        const repetirSenha = document.getElementById('repetir-senha')

        if(senha.value.length < 6 || senha.value.length >12){
            this.criaErro(senha,'Senha deve conter entre 6 e 12 caracteres')
            valid = false
        }

        if(senha.value !== repetirSenha.value){
            this.criaErro(repetirSenha,'As Senhas devem ser iguais')
            valid = false
        }

        return valid
    }

    validaCPF(campo){
        const cpf = new ValidaCPF(campo.value)
        if(!cpf.valida()){
            this.criaErro(campo,`CPF inválido`)
            return false
        }
        return true
    }

    criaErro(campo,msg){
       const div = document.createElement('div') //Criar o elemento Div
       div.innerText = msg
       div.classList.add('error-text') //Criar a classe error
        campo.insertAdjacentElement('afterend',div)
    }
    
}




const valida = new ValidaFormulario()