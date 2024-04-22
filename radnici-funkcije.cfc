<cfcomponent>

    <cfheader name="Access-Control-Allow-Origin" value="*" />
    <cfheader name="Access-Control-Allow-Methods" value="GET, POST, DELETE, PUT, OPTIONS" />
    <cfheader name="Access-Control-Allow-Headers" value="Content-Type" />
    <cfheader name="Access-Control-Max-Age" value="86400" /> 

    <cffunction name="prikaz_svih_radnika" access="remote" returnformat="json">
        <cfquery name="svi_radnici" datasource="radnici_db">
            SELECT * FROM radnici
        </cfquery>
        <cfreturn svi_radnici>
    </cffunction>

    <cffunction name="kreiraj_novog_radnika" access="remote" returntype="struct" returnformat="json">
        <cfset var odgovor = StructNew()>
        <cfset odgovor.poruka = "">
        <cfset odgovor.uspjeh = false>
        <cfset odgovor.lista = "">
        
        <cfquery name="novi_radnik" datasource="radnici_db" result="novi_radnik_result">
            INSERT INTO radnici (
                ime,
                prezime,
                pozicija,
                datum_zaposlenja,
                plata
            ) VALUES (   
                <cfqueryparam value="#arguments.ime#" cfsqltype="CF_SQL_VARCHAR">,
                <cfqueryparam value="#arguments.prezime#" cfsqltype="CF_SQL_VARCHAR">,
                <cfqueryparam value="#arguments.pozicija#" cfsqltype="CF_SQL_VARCHAR">,
                <cfqueryparam value="#arguments.datum_zaposlenja#" cfsqltype="CF_SQL_TIMESTAMP">,
                <cfqueryparam value="#arguments.plata#" cfsqltype="CF_SQL_NUMERIC">
            )
        </cfquery>

        <cfif novi_radnik_result.recordCount GT 0>
            <cfset odgovor.uspjeh = true>
            <cfset odgovor.poruka = "Novi radnik uspješno kreiran">
            <cfset odgovor.lista = prikaz_svih_radnika()>
        <cfelse>
            <cfset odgovor.poruka = "Greška prilikom kreiranja novog radnika">
        </cfif> 

        <cfreturn odgovor>
    </cffunction>

    <cffunction name="obrisi_radnika" access="remote" returntype="struct" returnformat="json">
        <cfargument name="radnik_id" type="numeric" required="true">

        <cfset var odgovor = StructNew()>
        <cfset odgovor.poruka = "">
        <cfset odgovor.uspjeh = false>
        <cfset odgovor.lista = "">
        
        <cfset var radnik_id = arguments.radnik_id>

        <cfquery name="brisanje_radnika" datasource="radnici_db" result="brisanje_radnika_result">
            DELETE FROM radnici WHERE id = <cfqueryparam value="#radnik_id#" cfsqltype="CF_SQL_INTEGER">
        </cfquery>

        <cfif brisanje_radnika_result.recordCount GT 0>
            <cfset odgovor.uspjeh = true>
            <cfset odgovor.poruka = "Radnik uspješno obrisan">
            <cfset odgovor.lista = prikaz_svih_radnika()>
        <cfelse>
            <cfset odgovor.poruka = "Greška prilikom brisanja radnika">
        </cfif>

        <cfreturn odgovor>
    </cffunction>

    <cffunction name="azuriraj_radnika" access="remote" returntype="struct" returnformat="json">
        <cfset var odgovor = StructNew()>
        <cfset odgovor.poruka = "">
        <cfset odgovor.uspjeh = false>
        <cfset odgovor.lista = "">

        <cfset var radnik_id = Trim(Form.radnik_id)>
        <cfset var novo_ime = Trim(Form.novo_ime)>
        <cfset var novo_prezime = Trim(Form.novo_prezime)>
        <cfset var nova_pozicija = Trim(Form.nova_pozicija)>
        <cfset var novi_datum_zaposlenja = Trim(Form.novi_datum_zaposlenja)>
        <cfset var nova_plata = Trim(Form.nova_plata)>
     
        <cfquery name="azuriranje_radnika" datasource="radnici_db" result="azuriranje_radnika_result">
            UPDATE radnici
            SET ime = <cfqueryparam value="#novo_ime#" cfsqltype="CF_SQL_VARCHAR">,
                prezime = <cfqueryparam value="#novo_prezime#" cfsqltype="CF_SQL_VARCHAR">,
                pozicija = <cfqueryparam value="#nova_pozicija#" cfsqltype="CF_SQL_VARCHAR">,
                datum_zaposlenja = <cfqueryparam value="#novi_datum_zaposlenja#" cfsqltype="CF_SQL_DATE">,
                plata = <cfqueryparam value="#nova_plata#" cfsqltype="CF_SQL_NUMERIC">
            WHERE id = <cfqueryparam value="#radnik_id#" cfsqltype="CF_SQL_INTEGER">
        </cfquery>

        <cfif azuriranje_radnika_result.recordCount GT 0>
            <cfset odgovor.uspjeh = true>
            <cfset odgovor.poruka = "Radnik uspješno ažuriran">
            <cfset odgovor.lista = prikaz_svih_radnika()>
        <cfelse>
            <cfset odgovor.poruka = "Greška prilikom ažuriranja radnika">
        </cfif>

        <cfreturn odgovor>
    </cffunction>

</cfcomponent>
