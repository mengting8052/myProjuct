<template>
  <div>
    <Form ref="editWareHouse" :model="modal.data" :label-width="100" :rules="modal.rules">
      <Row>
        <Col span="12">
          <!-- 上级部门 -->
          <FormItem
            :label="$t('warehouseManage.form.label.organParentId')"
            prop="warehouseDetail.organParentIds"
          >
            <org-cascader
              :orgs="orgData"
              :org-ids="modal.data.warehouseDetail.organParentIds"
              @on-selected-data-change="orgChange"
              :clearable="false"
            ></org-cascader>
          </FormItem>
          <!-- 仓库类型 -->
          <FormItem :label="$t('warehouseManage.form.label.type')" prop="warehouseDetail.type">
            <config-select code="warehouseType" v-model="modal.data.warehouseDetail.type"></config-select>
          </FormItem>
          <!-- 仓库名称 -->
          <FormItem :label="$t('warehouseManage.form.label.name')" prop="warehouseDetail.name">
            <Input type="text" v-model="modal.data.warehouseDetail.name"></Input>
          </FormItem>
          <!-- 仓库编号 -->
          <FormItem :label="$t('warehouseManage.form.label.code')" prop="warehouseDetail.code">
            <Input type="text" v-model="modal.data.warehouseDetail.code"></Input>
          </FormItem>
          <!-- 仓库简称 -->
          <FormItem
            :label="$t('warehouseManage.form.label.shortName')"
            prop="warehouseDetail.shortName"
          >
            <Input type="text" v-model="modal.data.warehouseDetail.shortName"></Input>
          </FormItem>
          <!-- 负责人 -->
          <FormItem
            :label="$t('warehouseManage.form.label.leaderEmp')"
            prop="warehouseDetail.leaderEmpName"
          >
            <Input
              type="text"
              style="width: 200px;"
              readonly
              v-model="modal.data.warehouseDetail.leaderEmpName"
            >
              <Button slot="append" icon="ios-search-strong" @click="visible = !visible;"></Button>
            </Input>
          </FormItem>
          <!-- 手机号码 -->
          <FormItem :label="$t('warehouseManage.form.label.phone')" prop="warehouseDetail.phone">
            <Input type="text" v-model="modal.data.warehouseDetail.phone"></Input>
          </FormItem>
          <!-- 联系电话 -->
          <FormItem :label="$t('warehouseManage.form.label.tel')" prop="warehouseDetail.tel">
            <Input type="text" v-model="modal.data.warehouseDetail.tel"></Input>
          </FormItem>
        </Col>

        <Col span="12">
          <!-- 邮箱 -->
          <FormItem :label="$t('warehouseManage.form.label.email')" prop="warehouseDetail.email">
            <Input type="text" v-model="modal.data.warehouseDetail.email" :maxlength="128"></Input>
          </FormItem>
          <!-- 地址 -->
          <FormItem
            :label="$t('warehouseManage.form.label.address')"
            prop="warehouseDetail.address"
          >
            <region-cascader
              :region-ids="regionIds"
              @on-selected-data-change="regionChange"
              style="display: inline-block;"
            ></region-cascader>
            <Input type="text" style="width: 200px;" v-model="modal.data.warehouseDetail.address"></Input>
          </FormItem>
          <!-- 经度 -->
          <FormItem
            :label="$t('storeManage.form.label.longitude')"
            prop="warehouseDetail.longitude"
          >
            <Input type="text" v-model="modal.data.warehouseDetail.longitude"></Input>
          </FormItem>
          <!-- 维度 -->
          <FormItem :label="$t('storeManage.form.label.latitude')" prop="warehouseDetail.latitude">
            <Input type="text" v-model="modal.data.warehouseDetail.latitude"></Input>
          </FormItem>
          <FormItem label="ABN">
            <Input type="text" v-model="modal.data.warehouseDetail.abn"></Input>
          </FormItem>
          <FormItem label="ACN">
            <Input type="text" v-model="modal.data.warehouseDetail.acn"></Input>
          </FormItem>
          <!-- 备注 -->
          <FormItem :label="$t('warehouseManage.form.label.remark')" prop="warehouseDetail.remark">
            <Input
              type="textarea"
              v-model="modal.data.warehouseDetail.remark"
              :maxlength="256"
              style="width: 600px;"
            ></Input>
          </FormItem>
        </Col>
      </Row>

      <!-- 可使用产品 -->
      <FormItem :label="$t('warehouseManage.form.label.appIds')" prop="appIds">
        <app-check-box-group :app-ids="modal.data.appIds" @on-change="appChange"></app-check-box-group>
      </FormItem>
      
      <FormItem>
        <Button
          type="primary"
          @click="confirm()"
          :loading="btnLoading"
        >{{ $t("warehouseManage.btns.save") }}</Button>
        <Button type="ghost" @click="resetForm()">{{ $t("warehouseManage.btns.cancel") }}</Button>
      </FormItem>
    </Form>
    <org-employee :visible.sync="visible" @on-select="employeeSelect"></org-employee>
  </div>
</template>

<script>
import { ConfigSelect } from "@/components/config";
import { OrgCascader, OrgEmployee } from "@/components/org";
import { RegionCascader } from "@/components/region";
import { AppCheckBoxGroup } from "@/components/app";

import { detail, update } from "@/api/tenant/wareHouse";
import { fetchOrgTree } from "@/api/tenant/orgManage";

import { mapGetters } from "vuex";
const WAREHOUSE_OBJ = Object.freeze({
  type: "", //仓库类型
  name: "", //仓库名称
  code: "", //编号
  shortName: "", //简称
  organParentId: [], //上级部门id
  organParentIds: [], //选中的所有部门id集合
  leaderEmpId: "", //负责人id
  phone: "", //手机号码
  tel: "", //联系电话
  address: "",
  longitude: "",
  latitude: "",
  remark: "",
  city: "",
  country: "",
  county: "",
  province: "",
  status: "",
  abn: "",
  acn: "",
  email: ""
});
export default {
  name: "editWarehouse",

  components: {
    ConfigSelect,
    OrgCascader,
    OrgEmployee,
    RegionCascader,
    AppCheckBoxGroup
  },

  data() {
    return {
      modal: {
        data: {
          appIds: [],
          warehouseDetail: Object.assign({}, WAREHOUSE_OBJ)
        },
        rules: {
          "warehouseDetail.type": [
            {
              required: true,
              message: this.$t("warehouseManage.form.rule.type"),
              trigger: "blur"
            }
          ],
          "warehouseDetail.name": [
            {
              required: true,
              message: this.$t("warehouseManage.form.rule.name"),
              trigger: "blur"
            }
          ],
          "warehouseDetail.code": [
            {
              required: true,
              message: this.$t("warehouseManage.form.rule.code"),
              trigger: "blur"
            }
          ],
          "warehouseDetail.address": [
            {
              required: true,
              message: this.$t("warehouseManage.form.rule.address"),
              trigger: "blur"
            }
          ],
          // "warehouseDetail.organParentIds": [{required: true,message: this.$t('warehouseManage.form.rule.organParentIds'),type: "array", trigger: "blur"}],
          "warehouseDetail.leaderEmpName": [
            {
              required: true,
              message: this.$t("warehouseManage.form.rule.leaderEmpName"),
              trigger: "blur"
            }
          ],
          appIds: [
            {
              required: true,
              type: "array",
              message: this.$t("warehouseManage.form.rule.canUseApps"),
              trigger: "ignor"
            }
          ]
        }
      },
      btnLoading: false,
      visible: false, //负责人弹窗
      orgData: [], //上级部门
      regionIds: [] //省市
    };
  },

  created() {
    this.getOrgData();
    detail(this.$route.query.id).then(res => {
      res.data.warehouseDetail.organParentIds.pop();
      this.modal.data.warehouseDetail = res.data.warehouseDetail;
      this.modal.data.appIds = res.data.appIds;
      // 初始化城市级联 initRegions 模型, 用以初始化 RegionCascader 组件
      let regionIds = [];
      this.modal.data.warehouseDetail.country &&
        regionIds.push(this.modal.data.warehouseDetail.country);
      this.modal.data.warehouseDetail.province &&
        regionIds.push(this.modal.data.warehouseDetail.province);
      this.modal.data.warehouseDetail.city &&
        regionIds.push(this.modal.data.warehouseDetail.city);
      this.modal.data.warehouseDetail.county &&
        regionIds.push(this.modal.data.warehouseDetail.county);
      this.regionIds = regionIds;
    });
  },

  computed: {
    ...mapGetters(["user"])
  },

  methods: {
    // 获取上级部门数据
    getOrgData() {
      // 递归处理从服务端获取的数据集合
      // 添加 Tree、Cascade Component 所需的特殊键名: value, label, title 等
      // 添加后续 API 接口所需的特殊键名: parentIds, level 等
      function convertData(orgin, parentIds) {
        const orginParentIds =
          parentIds.length > 0 ? parentIds.slice(0, parentIds.length - 1) : [];
        if (!orgin.childTenantOrgan || orgin.childTenantOrgan.length == 0) {
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            code: orgin.code,
            id: orgin.id,
            name: orgin.name,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type: orgin.type
          };
        } else {
          const childrens = orgin.childTenantOrgan.map(item => {
            return convertData(item, parentIds.concat(item.id));
          });
          return {
            value: orgin.id,
            label: orgin.name,
            title: orgin.name,
            expand: true,
            children: childrens,
            name: orgin.name,
            id: orgin.id,
            code: orgin.code,
            tenantId: orgin.tenantId,
            parentId: orgin.parentId,
            parentIds: orginParentIds,
            adminEmployeeId: orgin.adminEmployeeId,
            adminEmployeeName: orgin.adminEmployeeName,
            level: orgin.level,
            type: orgin.type
          };
        }
      }

      fetchOrgTree(this.user.tenantId).then(response => {
        this.orgData = response.data.map(item => convertData(item, [item.id]));
      });
    },

    // 选择上级部门
    orgChange(orgIds) {
      const orgIdsLength = orgIds.length;
      this.modal.data.warehouseDetail.organParentId = orgIds[orgIdsLength - 1];
      this.modal.data.warehouseDetail.organParentIds = orgIds;
    },

    // 选择负责人
    employeeSelect(employee) {
      this.modal.data.warehouseDetail.leaderEmpId = employee.uid;
      this.modal.data.warehouseDetail.leaderEmpName = employee.name;
    },

    // 选择省市
    regionChange(regionIds) {
      this.modal.data.warehouseDetail.selectedConsignee = regionIds;
      this.modal.data.warehouseDetail.country = regionIds[0] || "";
      this.modal.data.warehouseDetail.province = regionIds[1] || "";
      this.modal.data.warehouseDetail.city = regionIds[2] || "";
      this.modal.data.warehouseDetail.county = regionIds[3] || "";
    },

    // 选择产品
    appChange(appIds) {
      this.modal.data.appIds = appIds;
    },

    confirm() {
      this.$refs["editWareHouse"].validate(valid => {
        if (valid) {
          this.btnLoading = true;
          const model = {};
          if (this.modal.data.warehouseDetail) {
            for (var item in this.modal.data.warehouseDetail)
              if (this.modal.data.warehouseDetail[item] != "") {
                model[item] = this.modal.data.warehouseDetail[item];
              }
            model.status = this.modal.data.warehouseDetail.status; //status被过滤
          }
          this.modal.data.warehouseDetail = model;
          update(this.modal.data)
            .then(res => {
              this.btnLoading = false;
              this.$router.push({ name: "warehouse-manage-list" });
            })
            .catch(err => {
              this.$Message.error(err.message);
              this.btnLoading = false;
            });
        }
      });
    },

    resetForm() {
      this.$router.push({ name: "warehouse-manage-list" });
    }
  }
};
</script>
