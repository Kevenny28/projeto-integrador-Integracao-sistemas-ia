// Funcionários aprovados para integração
let funcionariosValidos = [];

// Erros encontrados durante a validação
let errosEncontrados = [];

function processarIntegracao() {

    const arquivo =
        document.getElementById("csvFile").files[0];

    if (!arquivo) {

        alert("Selecione um arquivo CSV.");

        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (e) {

        funcionariosValidos = [];
        errosEncontrados = [];

        const texto =
            e.target.result.trim();

        const linhas =
            texto.split("\n");

        const tbody =
            document.getElementById("tabela");

        tbody.innerHTML = "";

        let total = 0;

        for (let i = 1; i < linhas.length; i++) {

            total++;

            const valores =
                linhas[i]
                    .replace("\r", "")
                    .split(",");

            const funcionario = {

                nome: valores[0]?.trim(),

                cpf: valores[1]?.trim(),

                email: valores[2]?.trim(),

                cargo: valores[3]?.trim()

            };

            let valido = true;

            let motivo = "";

            // Nome obrigatório
            if (!funcionario.nome) {

                valido = false;

                motivo +=
                    "Nome não informado. ";
            }

            // CPF obrigatório
            if (!funcionario.cpf) {

                valido = false;

                motivo +=
                    "CPF não informado. ";
            }

            // Email obrigatório
            if (!funcionario.email) {

                valido = false;

                motivo +=
                    "Email não informado. ";
            }
            else if (
                !funcionario.email.includes("@")
            ) {

                valido = false;

                motivo +=
                    "Email inválido. ";
            }

            // Cargo obrigatório
            if (!funcionario.cargo) {

                valido = false;

                motivo +=
                    "Cargo não informado. ";
            }

            if (valido) {

                funcionariosValidos.push(
                    funcionario
                );
            }
            else {

                errosEncontrados.push(
                    `Linha ${i + 1}: ${motivo}`
                );
            }

            const tr =
                document.createElement("tr");

            tr.innerHTML = `
                <td>${funcionario.nome || ""}</td>
                <td>${funcionario.cpf || ""}</td>
                <td>${funcionario.email || ""}</td>
                <td>${funcionario.cargo || ""}</td>
                <td>
                    ${valido ? "Integrado" : "Rejeitado"}
                </td>
            `;

            tbody.appendChild(tr);
        }

        atualizarDashboard(total);

        atualizarErros();

        // Sistema Destino
        document.getElementById(
            "jsonDestino"
        ).value =
            JSON.stringify(
                funcionariosValidos,
                null,
                2
            );

        document.getElementById(
            "status"
        ).innerHTML =

`✓ Integração concluída

Sistema Origem (RH):
${total} registros recebidos

Sistema Destino (Controle de Acesso):
${funcionariosValidos.length} registros integrados
`;
    };

    leitor.readAsText(
        arquivo,
        "UTF-8"
    );
}

function atualizarDashboard(total) {

    const integrados =
        funcionariosValidos.length;

    const rejeitados =
        total - integrados;

    const sucesso =
        total > 0
            ? (
                (integrados / total)
                * 100
            ).toFixed(1)
            : 0;

    document.getElementById(
        "total"
    ).textContent = total;

    document.getElementById(
        "integrados"
    ).textContent = integrados;

    document.getElementById(
        "rejeitados"
    ).textContent = rejeitados;

    document.getElementById(
        "sucesso"
    ).textContent = sucesso + "%";

    document.getElementById(
        "destino"
    ).textContent = integrados;
}

function atualizarErros() {

    const lista =
        document.getElementById(
            "erros"
        );

    lista.innerHTML = "";

    errosEncontrados.forEach(
        erro => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent = erro;

            lista.appendChild(li);
        }
    );
}

function baixarJSON() {

    const blob =
        new Blob(

            [
                JSON.stringify(
                    funcionariosValidos,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "funcionarios_integrados.json";

    link.click();
}

function baixarRelatorio() {

    const relatorio =

`RELATÓRIO DE INTEGRAÇÃO

Sistema Origem:
RH

Sistema Destino:
Controle de Acesso

Total Processados:
${document.getElementById("total").textContent}

Integrados:
${document.getElementById("integrados").textContent}

Rejeitados:
${document.getElementById("rejeitados").textContent}

Taxa de Sucesso:
${document.getElementById("sucesso").textContent}

ERROS:

${errosEncontrados.join("\n")}
`;

    const blob =
        new Blob(
            [relatorio],
            {
                type:
                    "text/plain"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "relatorio_integracao.txt";

    link.click();
}