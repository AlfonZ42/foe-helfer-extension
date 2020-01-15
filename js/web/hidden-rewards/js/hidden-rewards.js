FoEproxy.addHandler('HiddenRewardService', 'getOverview', (data, postData) => {
    HiddenRewards.Cache = data.responseData.hiddenRewards;
    HiddenRewards.prepareData();
});

let HiddenRewards = {
    Cache: null,

    init: () => {
        if( $('#HiddenRewardBox').length < 1 ){

            HTML.Box({
                'id': 'HiddenRewardBox',
                'title': i18n.Boxes.HiddenRewards.Title,
                'auto_close': false,
                'dragdrop': true,
                'minimize': true
            });


            moment.locale(i18n['Local']);

            // CSS in den DOM prügeln
            HTML.AddCssFile('hidden-rewards');
        }

        HiddenRewards.BuildBox();
    },

    prepareData: () => {
        var data = [];

        for(let idx in HiddenRewards.Cache) {
            let position = HiddenRewards.Cache[idx].position.context;

            if(i18n['HiddenRewards']['Positions'][HiddenRewards.Cache[idx].position.context]) {
                position = i18n['HiddenRewards']['Positions'][HiddenRewards.Cache[idx].position.context];
            }

            data.push({
                type: HiddenRewards.Cache[idx].type,
                position: position,
                starts: HiddenRewards.Cache[idx].startTime,
                expires: HiddenRewards.Cache[idx].expireTime,
            });
        }

        data.sort(function (a, b) {
            if(a.expires < b.expires) return -1;
            if(a.expires > b.expires) return 1;
            return 0;
        });

        HiddenRewards.Cache = data;
    },

    BuildBox:()=> {
        var h = [];

        h.push('<table class="foe-table">');

        h.push('<thead>');
            h.push('<tr>');
                h.push('<th>' + i18n.HiddenRewards.Table.type + '</th>');
                h.push('<th>' + i18n.HiddenRewards.Table.position + '</th>');
                h.push('<th>' + i18n.HiddenRewards.Table.expires + '</th>');
            h.push('</tr>');
        h.push('</thead>');

        h.push('<tbody>');

        let cnt = 0;
        for (let idx in HiddenRewards.Cache) {
            var hiddenReward = HiddenRewards.Cache[idx];

            let StartTime = moment.unix(hiddenReward.starts),
                EndTime = moment.unix(hiddenReward.expires);

            if (EndTime > new Date().getTime()) {
                h.push('<tr>');
                h.push('<td class="incident ' + hiddenReward.type + '" title="' + hiddenReward.type + '">&nbsp;</td>');
                h.push('<td>' + hiddenReward.position + '</td>');
                if (StartTime > new Date().getTime()) {
                    h.push('<td class="warning">' + 'Erscheint ' + moment.unix(hiddenReward.starts).fromNow() + '</td>'); //Todo: Translate
                }
                else {
                    h.push('<td class="">' + 'Verschwindet ' + moment.unix(hiddenReward.expires).fromNow() + '</td>'); //Todo: Translate
                }
                h.push('</tr>');
                cnt++;
            }
        }
        if (cnt === 0) {
            h.push('<td colspan="3">' + 'Keine Ereignisse vorhanden' + '</td>'); //Todo: Translate
        }

        h.push('</tbody>');

        h.push('</table>');

        jQuery('#HiddenRewardBoxBody').html(h.join(''));
    }
}