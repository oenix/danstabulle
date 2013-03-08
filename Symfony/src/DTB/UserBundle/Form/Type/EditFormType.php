<?php

namespace DTB\UserBundle\Form\Type;

use Symfony\Component\Form\FormBuilderInterface;
use FOS\UserBundle\Form\Type\ProfileFormType as BaseType;

class EditFormType extends BaseType {

    public function buildForm(FormBuilderInterface $builder, array $options) {
        parent::buildForm($builder, $options);
        
        //Preventing user from editing its own username
        $builder->remove('username');

        $builder->add('description');
        $builder->add('firstName');
        $builder->add('lastName');
        $builder->add('city');
        $builder->add('birthDate', 'birthday', array('format' => 'dd - MM - yyyy', 'widget' => 'choice', 'years' => range(date('Y'), date('Y') - 70)));
        $builder->add('facebook');
        $builder->add('twitter');
        $builder->add('skype');
    }

    public function getDefaultOptions(array $options) {
        return array('data_class' => 'FOS\UserBundle\Form\Model\CheckPassword');
    }

    public function getName() {
        return 'dtb_edit_profile';
    }

}

?>
